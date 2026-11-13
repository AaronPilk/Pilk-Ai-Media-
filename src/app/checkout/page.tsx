import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RedirectNotice } from "@/components/layout/RedirectNotice";

// There is no online checkout any more: every project is quoted first. Old
// links and bookmarks land here and are sent to the project brief.
export const metadata: Metadata = buildMetadata({
  title: "Get a quote",
  description: "Pilk.ai quotes every project in writing. Tell us about your website and we'll send a quote.",
  path: "/checkout",
  noindex: true,
});

export default function CheckoutPage() {
  return (
    <RedirectNotice eyebrow="Get a quote" heading="We quote every project now.">
      <p>
        Nothing is sold through this site. Tell us what you need and we&apos;ll send a written quote.
        Taking you to the project brief…
      </p>
    </RedirectNotice>
  );
}
