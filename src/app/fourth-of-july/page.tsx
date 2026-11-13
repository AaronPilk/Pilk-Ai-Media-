import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { RedirectNotice } from "@/components/layout/RedirectNotice";

// The 4th of July sale ended in July 2026. Its fixed sale price can't stay up,
// so old ad links land here and go on to the project brief.
export const metadata: Metadata = buildMetadata({
  title: "4th of July offer ended",
  description: "The 4th of July website offer has ended. Tell us about your project and Pilk.ai will send a written quote.",
  path: "/fourth-of-july",
  noindex: true,
});

export default function FourthOfJulyPage() {
  return (
    <RedirectNotice eyebrow="Offer ended" heading="The 4th of July offer has ended." seconds={5}>
      <p>
        Thanks for coming back. That sale is over, but we still build real estate and mortgage
        websites. Tell us what you need and we&apos;ll send a written quote.
      </p>
    </RedirectNotice>
  );
}
