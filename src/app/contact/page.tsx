import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectBriefWizard } from "@/components/contact/ProjectBriefWizard";

export const metadata: Metadata = buildMetadata({
  title: "Start a Project",
  description:
    "Build your website brief in a few minutes — business, goals, starting design, colors, inspiration, and budget. Start with a template or commission something fully custom.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="relative z-10 pb-24 pt-[clamp(7rem,18vh,12rem)]">
      <Container className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel>Start a project</SectionLabel>
          <h1 className="mt-6 max-w-[14ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Tell us about your website.
          </h1>
          <p className="mt-6 max-w-sm text-muted">
            A few quick steps to shape your project. You&apos;ll pick a direction, colors, and
            references — we&apos;ll turn it into a plan and reach out.
          </p>

          <div className="mt-10 flex flex-col gap-3 text-sm">
            <a href={`mailto:${site.contact.email}`} className="text-muted hover:text-ink">
              {site.contact.email}
            </a>
            <a href={site.contact.phoneHref} className="text-muted hover:text-ink">
              {site.contact.phone}
            </a>
            <span className="text-muted">{site.location}</span>
          </div>
        </div>

        <div>
          <Suspense fallback={null}>
            <ProjectBriefWizard />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
