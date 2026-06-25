import Link from "next/link";
import { projects } from "@/content/projects";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

export function FeaturedWork() {
  return (
    <section className="section relative z-10">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <SectionLabel index="02">Selected Work</SectionLabel>
            <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
              Designs built to be remembered.
            </h2>
          </div>
          <Link href="/work" className="hidden shrink-0 text-sm text-muted hover:text-ink md:block">
            All work →
          </Link>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {projects.slice(0, 4).map((project, i) => (
            <Reveal key={project.slug} delay={i * 70}>
              <Link
                href={`/work/${project.slug}`}
                data-cursor="view"
                data-cursor-label="View"
                className="group block"
              >
                <div className="aspect-[16/10] transition-transform duration-700 ease-expo group-hover:-translate-y-1.5">
                  <FauxBrowser accent={project.accent} url={`${project.slug}.pilk.ai`} />
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <h3 className="text-xl font-medium">{project.name}</h3>
                  <span className="eyebrow opacity-70">{project.label}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{project.category}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
