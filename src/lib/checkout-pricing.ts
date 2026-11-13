// Single source of truth for checkout pricing — imported by the /checkout UI
// AND recomputed server-side in functions/api/checkout.ts. Never trust the
// client's amounts; the Function recomputes from the selected add-on keys.

export const CHECKOUT = {
  currency: "usd",
  base: 500, // one-time website build (USD)
  addonPrice: 100, // each add-on (USD)
  feeRate: 0.1, // 10% fees & processing on the whole one-time order
  monthly: 100, // recurring hosting (USD/mo)
  monthlyTrialDays: 30, // first monthly charge lands 30 days after the initial payment
} as const;

export type AddonKey = "rush" | "ghl" | "analytics" | "meta" | "posthog";

export const ADDONS: {
  key: AddonKey;
  label: string;
  blurb: string;
}[] = [
  {
    key: "rush",
    label: "Rush delivery — done in 5 days",
    blurb:
      "Jump the line: we build and deliver your mortgage site in 5 days instead of the standard 14, counted from when we have your content and approvals.",
  },
  {
    key: "ghl",
    label: "GoHighLevel connection",
    blurb:
      "We wire your site's forms straight into your GoHighLevel sub-account so every lead lands in your CRM.",
  },
  {
    key: "analytics",
    label: "Google Analytics + Google tags",
    blurb: "GA4 and the Google tag installed and verified for full traffic + conversion tracking.",
  },
  {
    key: "meta",
    label: "Meta Pixel",
    blurb: "Meta Pixel installed so your ads can track conversions and retarget visitors.",
  },
  {
    key: "posthog",
    label: "PostHog analytics",
    blurb:
      "Session-level analytics — see exactly what visitors do, where they drop off, and full data reporting.",
  },
];

export function priceCents(selected: AddonKey[]) {
  const count = selected.length;
  const subtotal = CHECKOUT.base + CHECKOUT.addonPrice * count;
  const subtotalCents = subtotal * 100;
  const feeCents = Math.round(subtotalCents * CHECKOUT.feeRate);
  const totalCents = subtotalCents + feeCents;
  return { count, subtotal, subtotalCents, feeCents, totalCents };
}
