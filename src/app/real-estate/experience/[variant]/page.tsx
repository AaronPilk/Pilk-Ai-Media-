import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { experiences, experienceList } from "@/content/experiences";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DroneExperience } from "@/components/experience/DroneExperience";
import { ExperienceSite } from "@/components/experience/ExperienceSite";

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
