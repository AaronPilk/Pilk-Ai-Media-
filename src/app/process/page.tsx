import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { Process } from "@/components/sections/Process";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: "Process",
  description:
    "How Pilk.ai Media builds websites — from discovery and positioning to design, build, test, and launch.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <PageIntro
        eyebrow="Process"
        title="From raw idea to a website that works."
        sub="A clear, repeatable process — so you always know what's happening and why."
      />
      <Process />
      <FinalCTA />
    </>
  );
}
