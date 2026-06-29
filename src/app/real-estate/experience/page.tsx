import type { Metadata } from "next";
import Link from "next/link";
import { experienceList } from "@/content/experiences";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = buildMetadata({
  title: "Interactive Listing Experiences — Custom Build Demos",
  description:
    "Two scroll-driven, cinematic real-estate experiences built by Pilk.ai. Fly a drone through the property as listing, agent, and firm details reveal.",
  path: "/real-estate/experience",
});

export default function ExperienceChooserPage() {
  return (
    <>
      <header className="relative z-10 pb-8 pt-[clamp(7rem,18vh,12rem)]">
        <Container>
          <SectionLabel>Interactive listing experiences</SectionLabel>
          <h1 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-hero)" }}>
            Scroll, and you fly through the property.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted">
            Two examples of fully custom, scroll-driven listing sites — each built from a single
            continuous drone shot, with property, agent, and firm details revealing as you go. Open
            each and feel the difference.
          </p>
        </Container>
      </header>

      <section className="section relative z-10 pt-8">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {experienceList.map((e) => (
              <Link
                key={e.slug}
                href={`/real-estate/experience/${e.slug}`}
                className="group relative block overflow-hidden rounded-[24px] border border-line"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('${e.poster}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="relative flex min-h-[360px] flex-col justify-end gap-3 p-8">
                  <span className="eyebrow text-white/80">{e.label}</span>
                  <h2 className="text-balance text-white" style={{ fontSize: "var(--text-xl)" }}>
                    {e.label === "The Estate" ? "Waterfront mansion tour" : "City skyline penthouse"}
                  </h2>
                  <p className="max-w-md text-sm text-white/75">{e.blurb}</p>
                  <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-transform group-hover:-translate-y-0.5">
                    Launch experience →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-muted">
            Best experienced on desktop — scroll slowly to fly the drone. On phones, each plays as a
            cinematic video behind the same story.
          </p>
        </Container>
      </section>
    </>
  );
}
