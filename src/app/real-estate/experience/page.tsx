import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DroneExperience } from "@/components/experience/DroneExperience";

export const metadata: Metadata = buildMetadata({
  title: "Interactive Property Experience — Custom Build Demo",
  description:
    "A scroll-driven, cinematic real-estate experience: fly a drone through the property as listing and firm details reveal. An example of the custom websites Pilk.ai builds.",
  path: "/real-estate/experience",
});

export default function ExperiencePage() {
  return (
    <>
      <DroneExperience />

      <section className="section relative z-10 bg-black">
        <Container className="text-center">
          <SectionLabel>What you just experienced</SectionLabel>
          <h2 className="mx-auto mt-6 max-w-[20ch] text-balance text-white" style={{ fontSize: "var(--text-2xl)" }}>
            A fully custom, scroll-driven website — built around a single video.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-white/70">
            Cinematic scroll scrubbing, reveal-on-scroll storytelling, and a build engineered for
            performance. This is the level of custom work we create for listings, brands, and
            businesses that want to stand out.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/contact?projectType=custom" variant="primary" withArrow>
              Build something like this
            </Button>
            <Button href="/real-estate" variant="ghost">
              Back to real estate
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
