/// <reference types="@cloudflare/workers-types" />
// POST /api/checkout — retired. pilk.ai quotes every project and bills by
// invoice, so this answers 410 Gone for any request and never calls Stripe.
// It stays deployed (instead of a 404/405 from the static layer) so an old tab
// or a stale script gets a clear, machine-readable answer. Subscriptions
// started through the old checkout are still served by stripe-webhook.ts.

function gone(): Response {
  return new Response(
    JSON.stringify({
      success: false,
      code: "checkout_retired",
      error: "Online checkout is closed. Every project now starts with a written quote: https://pilk.ai/contact/",
    }),
    { status: 410, headers: { "content-type": "application/json", "cache-control": "no-store" } }
  );
}

export const onRequestPost = async (): Promise<Response> => gone();
export const onRequestGet = async (): Promise<Response> => gone();
