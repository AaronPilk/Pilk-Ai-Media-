import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RedirectNotice } from "@/components/layout/RedirectNotice";

export const metadata: Metadata = buildMetadata({
  title: "Get a quote",
  description: "Pilk.ai quotes every project in writing. Tell us about your website and we'll send a quote.",
  path: "/checkout/cancel",
  noindex: true,
});

export default function CheckoutCancelPage() {
  return (
    <RedirectNotice eyebrow="No charge made" heading="Nothing was charged.">
      <p>We quote every project in writing now. Taking you to the project brief…</p>
    </RedirectNotice>
  );
}
