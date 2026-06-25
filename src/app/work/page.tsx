import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/content/projects";
import { buildMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description:
    "Selected design and development work from Pilk.ai Media. Concept designs shown until client projects are published.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageIntro
        eyebrow="Work"
        title="Designs built to be remembered."
        sub="A look at the kind of work we build. Concept designs are clearly labeled; launched client work appears here as it ships."
      />

      <section className="section relative z-10 pt-4">
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 60}>
                <Link
                  href={`/work/${project.slug}`}
                  className="group block"
                  data-cursor="view"
                  data-cursor-label="View"
                >
                  <div className="aspect-[16/10] transition-transform duration-700 ease-expo group-hover:-translate-y-1.5">
                    <FauxBrowser accent={project.accent} url={`${project.slug}.pilk.ai`} />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between">
                    <h2 className="text-xl font-medium">{project.name}</h2>
                    <span className="eyebrow opacity-70">{project.label}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{project.category}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
