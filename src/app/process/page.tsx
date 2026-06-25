import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: "Process",
  description:
    "How Pilk.ai Media builds websites — from a first conversation to a launched site in seven days.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <div className="pt-[clamp(4rem,10vh,7rem)]">
      <ProcessTimeline />
      <FinalCTA />
    </div>
  );
}
