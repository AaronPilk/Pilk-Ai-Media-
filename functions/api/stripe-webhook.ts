/// <reference types="@cloudflare/workers-types" />
// POST /api/stripe-webhook — verifies the Stripe signature, then on a paid
// checkout creates the $100/mo hosting subscription with a 30-day trial so the
// first monthly charge lands one month after the initial payment.
import { stripe } from "./_stripe";
import { CHECKOUT, RENEWAL_CONSENT_TEXT, RENEWAL_CONSENT_VERSION } from "../../src/lib/checkout-pricing";
import { site } from "../../src/content/site";
import { sendToGhl } from "./_ghl";

type Env = {
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PRICE_MONTHLY?: string;
  RESEND_API_KEY?: string;
  LEADS_FROM_EMAIL?: string;
  LEADS_NOTIFICATION_EMAIL?: string;
  GHL_PIT_TOKEN?: string;
  GHL_LOCATION_ID?: string;
};

const encoder = new TextEncoder();

function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );
}

const longDate = (d: Date) =>
  d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/New_York" });

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
                renewal_consent: session.metadata?.renewal_consent || "",
                renewal_consent_version: session.metadata?.renewal_consent_version || "",
                renewal_consent_at: session.metadata?.renewal_consent_at || "",
              },
            },
            { idempotencyKey: `sub_${session.id}` }
          );
        }

        // Tag the contact as paid in GoHighLevel so the PILK AI pipeline advances
        const paidEmail = session.customer_details?.email;
        if (paidEmail) {
          await sendToGhl(env, {
            email: paidEmail,
            tags: ["pilk-paid"],
            customFields: [
              { key: "template_chosen", field_value: session.metadata?.template || "" },
              { key: "addons_purchased", field_value: session.metadata?.addons || "none" },
              { key: "order_amount", field_value: ((session.amount_total ?? 0) / 100).toFixed(2) },
            ],
          });
        }

        // Notify Aaron of the new order, and send the customer a copy of the
        // plan terms they can keep (state auto-renewal laws ask for one).
        if (env.RESEND_API_KEY && env.LEADS_FROM_EMAIL && env.LEADS_NOTIFICATION_EMAIL) {
          const amt = ((session.amount_total ?? 0) / 100).toFixed(2);
          const paidAt = new Date((session.created ?? Math.floor(Date.now() / 1000)) * 1000);
          const firstCharge = longDate(new Date(paidAt.getTime() + CHECKOUT.monthlyTrialDays * 86_400_000));
          const consent = session.metadata?.renewal_consent === "true";
          const sendEmail = (to: string, subject: string, html: string) =>
            fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${env.RESEND_API_KEY}`,
              },
              body: JSON.stringify({ from: env.LEADS_FROM_EMAIL, to, subject, html }),
            }).catch(() => {});

          await sendEmail(
            env.LEADS_NOTIFICATION_EMAIL,
            `New website order — $${amt}`,
            `<h2>New Pilk.ai website order</h2>
              <p><strong>Amount paid:</strong> $${esc(amt)} (includes the ${Math.round(CHECKOUT.feeRate * 100)}% fees &amp; processing line)</p>
              <p><strong>Customer:</strong> ${esc(session.customer_details?.email) || "—"}</p>
              <p><strong>Add-ons:</strong> ${esc(session.metadata?.addons) || "none"}</p>
              <p><strong>Template:</strong> ${esc(session.metadata?.template) || "—"}</p>
              <p>$${CHECKOUT.monthly}/mo hosting subscription created — first charge in ${CHECKOUT.monthlyTrialDays} days (${esc(firstCharge)}).</p>
              <h3 style="margin:16px 0 4px">Auto-renewal consent</h3>
              ${
                consent
                  ? `<p>Ticked at checkout before paying: “${esc(RENEWAL_CONSENT_TEXT)}”</p>
                     <p style="color:#555;font-size:12px">Recorded ${esc(session.metadata?.renewal_consent_at) || "—"} · wording <code>${esc(session.metadata?.renewal_consent_version) || "—"}</code> · Checkout Session ${esc(session.id)}</p>`
                  : `<p><strong>No renewal consent recorded on this session.</strong> Check the order before the first monthly charge.</p>`
              }`
          );

          const customerEmail = session.customer_details?.email;
          if (customerEmail) {
            const cancelHref = `mailto:${site.contact.email}?subject=${encodeURIComponent("Cancel my hosting plan")}&body=${encodeURIComponent(`Please cancel the $${CHECKOUT.monthly}/month hosting plan for ${customerEmail}.`)}`;
            await sendEmail(
              customerEmail,
              "Your Pilk.ai order and hosting plan",
              `<h2>Thanks for your order</h2>
                <p>Your payment of $${esc(amt)} went through. We'll be in touch shortly to start your website build.</p>
                <h3 style="margin:16px 0 4px">Your hosting plan</h3>
                <p>Your $${CHECKOUT.monthly}/month hosting, support and edits plan has started. The first $${CHECKOUT.monthly} charge is on ${esc(firstCharge)}, ${CHECKOUT.monthlyTrialDays} days after your purchase. It then renews automatically every month on that date, charged to the card you used, until you cancel.</p>
                <p><strong>How to cancel:</strong> email <a href="${esc(cancelHref)}">${esc(site.contact.email)}</a> or call ${esc(site.contact.phone)} at any time. Cancelling takes effect at the end of the month you've already paid for, and if you cancel before ${esc(firstCharge)} you won't be charged for the plan at all. Your website stays yours either way.</p>
                <p>Full terms: <a href="${esc(site.url)}/terms/">${esc(site.url)}/terms/</a></p>
                <p>— Pilk.ai</p>
                <p style="color:#888;font-size:12px">Pilk.ai is a brand of Pilk Consulting LLC.</p>`
            );
          }
        }
      }
    }
    return json({ received: true });
  } catch (e: any) {
    console.error("[stripe-webhook] error", e);
    return json({ error: e?.message || "handler error" }, 500);
  }
};
