import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Timeline } from "@/components/sections/Timeline";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: "Process",
  description:
    "How Pilk.ai Media builds websites — from a first conversation to a launched site in about 7 days.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <div className="pt-[clamp(4rem,10vh,7rem)]">
      <Timeline />
      <FinalCTA />
    </div>
  );
}
