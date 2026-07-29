/// <reference types="@cloudflare/workers-types" />
// POST /api/stripe-webhook — verifies the Stripe signature, then on a paid
// checkout creates the $100/mo hosting subscription with a 30-day trial so the
// first monthly charge lands one month after the initial payment.
import { stripe } from "./_stripe";
import { CHECKOUT } from "../../src/lib/checkout-pricing";

type Env = {
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PRICE_MONTHLY?: string;
  RESEND_API_KEY?: string;
  LEADS_FROM_EMAIL?: string;
  LEADS_NOTIFICATION_EMAIL?: string;
};

const encoder = new TextEncoder();

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function verifySignature(
  payload: string,
  header: string | null,
  secret: string
): Promise<boolean> {
  if (!header) return false;
  const fields: Record<string, string> = {};
  for (const kv of header.split(",")) {
    const idx = kv.indexOf("=");
    if (idx > 0) {
      const k = kv.slice(0, idx).trim();
      const v = kv.slice(idx + 1).trim();
      if (!(k in fields)) fields[k] = v;
    }
  }
  const t = fields["t"];
  const v1 = fields["v1"];
  if (!t || !v1) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(t, 10)) > 300) return false; // 5-minute tolerance
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(`${t}.${payload}`));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  if (hex.length !== v1.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ v1.charCodeAt(i);
  return diff === 0;
}

async function ensureMonthlyPrice(secret: string, env: Env): Promise<string> {
  if (env.STRIPE_PRICE_MONTHLY) return env.STRIPE_PRICE_MONTHLY;
  const found = await stripe(
    "prices",
    secret,
    { lookup_keys: ["pilk_hosting_monthly"], limit: 1 },
    { method: "GET" }
  );
  if (found.data && found.data.length) return found.data[0].id;
  const product = await stripe("products", secret, {
    name: "Pilk.ai Website Hosting & Support",
  });
  const price = await stripe("prices", secret, {
    unit_amount: CHECKOUT.monthly * 100,
    currency: CHECKOUT.currency,
    recurring: { interval: "month" },
    product: product.id,
    lookup_key: "pilk_hosting_monthly",
  });
  return price.id;
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return json({ error: "not configured" }, 503);
  }
  const payload = await request.text();
  const valid = await verifySignature(
    payload,
    request.headers.get("stripe-signature"),
    env.STRIPE_WEBHOOK_SECRET
  );
  if (!valid) return json({ error: "invalid signature" }, 400);

  let event: any;
  try {
    event = JSON.parse(payload);
  } catch {
    return json({ error: "bad json" }, 400);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (
        session.mode === "payment" &&
        session.payment_status === "paid" &&
        session.metadata?.start_monthly === "true"
      ) {
        const customer = session.customer;
        const piId = session.payment_intent;
        let pm: string | undefined;
        if (piId) {
          const pi = await stripe(`payment_intents/${piId}`, env.STRIPE_SECRET_KEY, undefined, {
            method: "GET",
          });
          pm = pi.payment_method;
        }
        if (customer && pm) {
          const price = await ensureMonthlyPrice(env.STRIPE_SECRET_KEY, env);
          await stripe(
            "subscriptions",
            env.STRIPE_SECRET_KEY,
            {
              customer,
              items: [{ price }],
              trial_period_days: CHECKOUT.monthlyTrialDays,
              default_payment_method: pm,
              metadata: {
                source: "pilk-checkout",
                checkout_session: session.id,
                template: session.metadata?.template || "",
              },
            },
            { idempotencyKey: `sub_${session.id}` }
          );
        }

        // Notify Aaron of the new order (best-effort)
        if (env.RESEND_API_KEY && env.LEADS_FROM_EMAIL && env.LEADS_NOTIFICATION_EMAIL) {
          const amt = ((session.amount_total ?? 0) / 100).toFixed(2);
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: env.LEADS_FROM_EMAIL,
              to: env.LEADS_NOTIFICATION_EMAIL,
              subject: `New website order — $${amt}`,
              html: `<h2>New Pilk.ai website order</h2>
                <p><strong>Amount paid:</strong> $${amt}</p>
                <p><strong>Customer:</strong> ${session.customer_details?.email || "—"}</p>
                <p><strong>Add-ons:</strong> ${session.metadata?.addons || "none"}</p>
                <p><strong>Template:</strong> ${session.metadata?.template || "—"}</p>
                <p>$${CHECKOUT.monthly}/mo hosting subscription created — first charge in ${CHECKOUT.monthlyTrialDays} days.</p>`,
            }),
          }).catch(() => {});
        }
      }
    }
    return json({ received: true });
  } catch (e: any) {
    console.error("[stripe-webhook] error", e);
    return json({ error: e?.message || "handler error" }, 500);
  }
};
