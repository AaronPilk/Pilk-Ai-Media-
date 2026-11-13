import type { Metadata } from "next";
import { buildMetadata, breadcrumbNode, pageGraph } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedServices } from "@/components/services/RelatedServices";
import { PageIntro } from "@/components/layout/PageIntro";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: "Our 7-Day Website Build Process",
  description:
    "Seven days from idea to launch: how Pilk.ai takes a qualified website project from the first conversation to a live site, one day at a time.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={pageGraph(
          breadcrumbNode([{ name: "Process", path: "/process/" }])
        )}
      />
      <PageIntro
        eyebrow="Process"
        title="Seven days from idea to launch."
        sub="For qualified standard and template-based websites, we move fast: direction, design, build, review, and launch in one focused sprint."
      />
      <ProcessTimeline standalone />
      <RelatedServices slugs={["websites", "lead-funnels", "custom-apps"]} />
      <FinalCTA />
    </>
  );
}
