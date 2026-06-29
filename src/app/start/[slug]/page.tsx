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
      <header className="relative z-10 pt-[clamp(7rem,18vh,12rem)]">
        <Container>
          <Link href={`/templates/${tpl.slug}`} className="text-sm text-muted hover:text-ink">
            ← Back to {tpl.name}
          </Link>
          <span className="eyebrow mt-6 block opacity-70">Order this template</span>
          <h1 className="mt-3" style={{ fontSize: "var(--text-2xl)" }}>
            Let&apos;s build your {tpl.name} site
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Fill this out and upload your logo, photos, and any copy you have. It all comes
            straight to us and we&apos;ll build your site with your content. Don&apos;t have
            something? Leave it blank — we&apos;ll handle the copy and use clean placeholders.
          </p>
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
