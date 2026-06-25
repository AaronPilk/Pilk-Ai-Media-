import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { templates, getTemplate, getRelatedTemplates } from "@/content/templates";
import { site } from "@/content/site";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ResponsivePreview } from "@/components/templates/ResponsivePreview";
import { TemplatePreviewButton } from "@/components/templates/TemplatePreviewButton";
import { TemplateCard } from "@/components/templates/TemplateCard";

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tpl = getTemplate(slug);
  if (!tpl) return buildMetadata({ title: "Template", path: `/templates/${slug}` });
  return buildMetadata({
    title: `${tpl.name} — ${tpl.label}`,
    description: tpl.shortDescription,
    path: `/templates/${slug}`,
  });
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tpl = getTemplate(slug);
  if (!tpl) notFound();

  const related = getRelatedTemplates(slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Templates", path: "/templates" },
              { name: tpl.name, path: `/templates/${slug}` },
            ])
          ),
        }}
      />

      <header className="relative z-10 pt-[clamp(7rem,18vh,12rem)]">
        <Container>
          <Link href="/templates" className="text-sm text-muted hover:text-ink">
            ← All templates
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="eyebrow opacity-70">{tpl.label}</span>
              <h1 className="mt-3" style={{ fontSize: "var(--text-2xl)" }}>{tpl.name}</h1>
              <p className="mt-4 max-w-xl text-lg text-muted">{tpl.shortDescription}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-semibold">
                {tpl.price > 0 ? `From $${formatPrice(tpl.price)}` : "Scope-based"}
              </p>
              <p className="text-sm text-muted">{tpl.timeline}</p>
            </div>
          </div>
        </Container>
      </header>

      <section className="section relative z-10 pt-12">
        <Container>
          <ResponsivePreview template={tpl} />

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              href={`/contact?projectType=template&template=${tpl.slug}`}
              variant="primary"
              withArrow
            >
              Request this design
            </Button>
            <TemplatePreviewButton template={tpl} />
          </div>

          <div className="mt-20 grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-medium">What&apos;s included</h2>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-muted">
                {tpl.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              {tpl.pages > 0 && (
                <p className="mt-6 text-sm text-muted">Includes {tpl.pages} pages.</p>
              )}
            </div>

            {tpl.upgrades.length > 0 && (
              <div>
                <h2 className="text-xl font-medium">Optional upgrades</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {tpl.upgrades.map((u) => (
                    <li
                      key={u}
                      className="rounded-full border border-line px-3 py-1 text-xs text-muted"
                    >
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className="mt-12 max-w-xl text-xs text-muted">{site.pricingDisclaimer}</p>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="section relative z-10 pt-0">
          <Container>
            <h2 className="mb-8 text-xl font-medium">Related designs</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <TemplateCard key={r.slug} template={r} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
