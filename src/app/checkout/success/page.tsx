import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RedirectNotice } from "@/components/layout/RedirectNotice";
import { site } from "@/content/site";

// Kept so a payment link or an old bookmark that points here still lands on a
// real page. Slower redirect, so someone who has just paid can read it.
export const metadata: Metadata = buildMetadata({
  title: "Thank you",
  description: "Thanks for your payment. Pilk.ai will be in touch about your project.",
  path: "/checkout/success",
  noindex: true,
});

export default function CheckoutSuccessPage() {
  return (
    <RedirectNotice eyebrow="Thank you" heading="Thanks. We'll be in touch." seconds={10}>
      <p>
        If you&apos;ve just paid an invoice, you&apos;re all set: your receipt comes by email and we&apos;ll
        reach out about next steps. Questions? Email{" "}
        <a href={`mailto:${site.contact.email}`} className="underline underline-offset-2 hover:text-ink">
          {site.contact.email}
        </a>
        .
      </p>
      <p>In a few seconds we&apos;ll take you to the project brief.</p>
    </RedirectNotice>
  );
}
