import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { templates, getTemplate } from "@/content/templates";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { TemplateIntakeForm } from "@/components/intake/TemplateIntakeForm";

// Intake only applies to real, duplicable templates (not the fully-custom build).
const intakeTemplates = templates.filter((t) => t.slug !== "custom-site");

export function generateStaticParams() {
  return intakeTemplates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tpl = getTemplate(slug);
  return buildMetadata({
    title: tpl ? `Order the ${tpl.name} template` : "Order a template",
    description: tpl
      ? `Send us your content and assets and we'll build your ${tpl.name} site.`
      : "Order a Pilk.ai template.",
    path: `/start/${slug}`,
  });
}

export default async function TemplateIntakePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tpl = getTemplate(slug);
  if (!tpl || tpl.slug === "custom-site") notFound();

  return (
    <>
      <header className="relative z-10 pt-[clamp(6rem,14vh,9rem)]">
        <Container className="max-w-lg">
          <Link href={`/templates/${tpl.slug}`} className="text-sm text-muted hover:text-ink">
            ← Back to {tpl.name}
          </Link>
        </Container>
      </header>

      <section className="section relative z-10 pt-12">
        <Container className="max-w-3xl">
          <Suspense fallback={<div className="text-muted">Loading form…</div>}>
            <TemplateIntakeForm templateSlug={tpl.slug} templateName={tpl.name} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
