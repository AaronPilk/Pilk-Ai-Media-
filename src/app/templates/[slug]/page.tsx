import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  templates,
  getTemplate,
  getRelatedTemplates,
  templateProjectType,
} from "@/content/templates";
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
  const isCustom = tpl.slug === "custom-site";

  // Comes with every template build (in addition to the template's own features).
  const everyBuild = [
    "Built with your branding, copy & photos",
    "Mobile-responsive on every device",
    "Lead form that emails you every inquiry",
    "Click-to-call, email & map ready",
    "Basic on-page SEO setup",
    "Launched on your domain",
    "One round of revisions",
  ];

  // What we ask the client to provide (all optional — we fill the gaps).
  const weNeed = [
    "Your logo — or we set clean type-based branding",
    "A few photos — or we use polished stock",
    "Your contact info & service area",
    "Any copy you already have (optional)",
  ];

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
            {isCustom ? (
              <Button
                href={`/contact/?projectType=${templateProjectType(tpl.label)}&template=${tpl.slug}`}
                variant="primary"
                withArrow
              >
                Start a custom build
              </Button>
            ) : (
              <Button href={`/start/${tpl.slug}`} variant="primary" withArrow>
                Order this template
              </Button>
            )}
            <TemplatePreviewButton template={tpl} />
            {tpl.liveUrl && (
              <a
                className="btn btn-ghost"
                href={tpl.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open full preview ↗
              </a>
            )}
          </div>

          {!isCustom && (
            <p className="mt-4 max-w-xl text-sm text-muted">
              How it works: pick this template, send us your logo, photos, and any copy on the next
              screen, and we build your site with your content — typically in about a week.
            </p>
          )}

          <div className="mt-20 grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-medium">This template includes</h2>
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

          {!isCustom && (
            <div className="mt-16 grid gap-8 rounded-[24px] border border-line bg-surface p-8 md:grid-cols-2 md:p-10">
              <div>
                <h2 className="text-xl font-medium">Every build also comes with</h2>
                <ul className="mt-4 grid gap-3 text-sm text-muted">
                  {everyBuild.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-accent">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-muted">
                  Want it kept fast, secure, and updated after launch? Add{" "}
                  <span className="text-ink">hosting &amp; support for $199/mo</span>.
                </p>
              </div>
              <div>
                <h2 className="text-xl font-medium">What we need from you</h2>
                <ul className="mt-4 grid gap-3 text-sm text-muted">
                  {weNeed.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-accent">—</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button href={`/start/${tpl.slug}`} variant="primary" withArrow>
                    Order this template
                  </Button>
                </div>
              </div>
            </div>
          )}

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
