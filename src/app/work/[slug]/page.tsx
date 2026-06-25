import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProject } from "@/content/projects";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return buildMetadata({ title: "Work", path: `/work/${slug}` });
  return buildMetadata({
    title: project.name,
    description: project.summary,
    path: `/work/${slug}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <header className="relative z-10 pt-[clamp(7rem,18vh,12rem)]">
        <Container>
          <Link href="/work" className="text-sm text-muted hover:text-ink">
            ← All work
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow opacity-70">
                {project.label} · {project.category}
              </span>
              <h1 className="mt-3" style={{ fontSize: "var(--text-2xl)" }}>{project.name}</h1>
            </div>
            <span className="text-sm text-muted">{project.year}</span>
          </div>
          <p className="mt-6 max-w-xl text-lg text-muted">{project.summary}</p>
        </Container>
      </header>

      <section className="section relative z-10 pt-12">
        <Container>
          <div className="aspect-[16/9]">
            <FauxBrowser accent={project.accent} url={`${project.slug}.pilk.ai`} image={project.cover} />
          </div>

          {project.services && (
            <div className="mt-10 flex flex-wrap gap-2">
              {project.services.map((s) => (
                <span key={s} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                  {s}
                </span>
              ))}
            </div>
          )}

          {project.label === "Concept" && (
            <p className="mt-10 max-w-xl text-sm text-muted">
              This is a concept design that demonstrates direction and capability. Full case studies
              with results appear here once a client project launches.
            </p>
          )}

          <div className="mt-12">
            <Button href="/contact" variant="primary" withArrow>
              Start a project like this
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
