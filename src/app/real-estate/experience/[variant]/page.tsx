import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { experiences, experienceList } from "@/content/experiences";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DroneExperience } from "@/components/experience/DroneExperience";
import { ExperienceSite } from "@/components/experience/ExperienceSite";
import { QuickInquiry } from "@/components/experience/QuickInquiry";

export function generateStaticParams() {
  return experienceList.map((e) => ({ variant: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const { variant } = await params;
  const cfg = experiences[variant];
  return buildMetadata({
    title: cfg ? `${cfg.label} — Interactive Listing Experience` : "Interactive Experience",
    description: cfg?.blurb ?? "A scroll-driven cinematic real-estate experience by Pilk.ai.",
    path: `/real-estate/experience/${variant}`,
    noindex: true,
  });
}

export default async function ExperienceVariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  const cfg = experiences[variant];
  if (!cfg) notFound();
  const other = experienceList.find((e) => e.slug !== variant);

  return (
    <>
      <DroneExperience config={cfg} />

      {/* The rest of the full website continues below the cinematic hero */}
      <ExperienceSite config={cfg} />

      {/* Always-available quick inquiry */}
      <QuickInquiry source={`${cfg.label} listing experience`} />

      {/* The property, agent, figures and reviews are invented for the demo.
          Say so on screen the whole time, not just in a footnote. */}
      <p className="fixed bottom-5 left-5 z-40 max-w-[45vw] rounded-full bg-black/70 px-3.5 py-2 text-[11px] font-medium leading-tight text-white/85 ring-1 ring-white/15 backdrop-blur print:hidden">
        Demo listing · fictional property, agent and reviews
      </p>

      <section className="section relative z-10 bg-[#0b0b0e]">
        <Container className="text-center">
          <SectionLabel>A Pilk.ai custom build</SectionLabel>
          <h2 className="mx-auto mt-6 max-w-[22ch] text-balance text-white" style={{ fontSize: "var(--text-xl)" }}>
            This entire site is a custom build — yours could be too.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href={cfg.ctaHref} variant="primary" withArrow>
              Build something like this
            </Button>
            {other && (
              <Button href={`/real-estate/experience/${other.slug}`} variant="ghost">
                See the &ldquo;{other.label}&rdquo; site →
              </Button>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
