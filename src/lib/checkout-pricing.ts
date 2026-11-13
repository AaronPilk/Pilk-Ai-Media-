// pilk.ai no longer sells online: every project is quoted, then invoiced.
// What is left here is only what functions/api/stripe-webhook.ts needs to keep
// serving hosting plans that customers started through the former online
// checkout (their subscription events and order emails), plus the Terms'
// paragraph that keeps those plans' terms. No page shows these figures, and no
// new purchase can start: /api/checkout answers 410. Remove it together with
// the webhook once no such plan is active.

export const CHECKOUT = {
  currency: "usd",
  feeRate: 0.1, // the former checkout's fees & processing line; only quoted in old-order emails
  monthly: 100, // recurring hosting (USD/mo) for plans started at the former checkout
  monthlyTrialDays: 30, // first monthly charge landed 30 days after the build payment
} as const;

/**
 * The box those customers ticked before paying. The version and wording stay
 * here, unchanged, so the webhook's order email can quote exactly what was
 * agreed to.
 */
export const RENEWAL_CONSENT_VERSION = "renewal-v1-2026-11-13";
export const RENEWAL_CONSENT_TEXT = `I agree to the $${CHECKOUT.monthly}/month hosting plan starting ${CHECKOUT.monthlyTrialDays} days after purchase, renewing monthly until I cancel.`;
