/// <reference types="@cloudflare/workers-types" />
import { stripe } from "./_stripe";
import { CHECKOUT, ADDONS, priceCents, type AddonKey } from "../../src/lib/checkout-pricing";

type Env = { STRIPE_SECRET_KEY?: string };

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

const VALID = new Set(ADDONS.map((a) => a.key));
const LABELS = new Map(ADDONS.map((a) => [a.key, a.label]));

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;
  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: "Payments aren't configured yet. Please contact us to complete your order." }, 503);
  }
  try {
    const body = (await request.json().catch(() => ({}))) as {
      addons?: string[];
      template?: string;
      email?: string;
    };
    const selected = (Array.isArray(body.addons) ? body.addons : []).filter(
      (a): a is AddonKey => VALID.has(a as AddonKey)
    );
    const { feeCents } = priceCents(selected);
    const origin = new URL(request.url).origin;

    const line_items: Record<string, unknown>[] = [
      {
        price_data: {
          currency: CHECKOUT.currency,
          product_data: { name: "Mortgage website build" },
          unit_amount: CHECKOUT.base * 100,
        },
        quantity: 1,
      },
      ...selected.map((k) => ({
        price_data: {
          currency: CHECKOUT.currency,
          product_data: { name: `Add-on: ${LABELS.get(k)}` },
          unit_amount: CHECKOUT.addonPrice * 100,
        },
        quantity: 1,
      })),
      {
        price_data: {
          currency: CHECKOUT.currency,
          product_data: { name: "Fees & processing (10%)" },
          unit_amount: feeCents,
        },
        quantity: 1,
      },
    ];

    const session = await stripe("checkout/sessions", env.STRIPE_SECRET_KEY, {
      mode: "payment",
      line_items,
      customer_creation: "always",
      payment_intent_data: { setup_future_usage: "off_session" },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${origin}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel/`,
      metadata: {
        product: "mortgage-website",
        addons: selected.join(",") || "none",
        template: body.template || "",
        start_monthly: "true",
        monthly_amount: String(CHECKOUT.monthly),
      },
      ...(body.email ? { customer_email: body.email } : {}),
    });

    return json({ url: session.url });
  } catch (e: any) {
    console.error("[checkout] error", e);
    return json({ error: e?.message || "Could not start checkout." }, 500);
  }
};
