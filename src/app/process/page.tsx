import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: "Process",
  description:
    "Seven days from idea to launch. How Pilk.ai Media takes a website from first conversation to live.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <PageIntro
        eyebrow="Process"
        title="Seven days from idea to launch."
        sub="For qualified standard and template-based websites, we move fast: direction, design, build, review, and launch in one focused sprint."
      />
      <ProcessTimeline standalone />
      <FinalCTA />
    </>
  );
}
