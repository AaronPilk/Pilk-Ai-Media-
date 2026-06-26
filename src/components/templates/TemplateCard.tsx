import Link from "next/link";
import type { WebsiteTemplate } from "@/types/template";
import { templateCategories, templateProjectType } from "@/content/templates";
import { formatPrice } from "@/lib/utils";
import { TemplateLivePreview } from "@/components/templates/TemplateLivePreview";

function categoryLabel(id: string) {
  return templateCategories.find((c) => c.id === id)?.label ?? "Template";
}

export function TemplateCard({ template }: { template: WebsiteTemplate }) {
  const projectType = templateProjectType(template.label);
  const startHref = `/contact/?projectType=${projectType}&template=${template.slug}`;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-line bg-surface p-4 transition-colors hover:border-ink/30">
      <Link
        href={`/templates/${template.slug}`}
        className="block aspect-[16/10] transition-transform duration-700 ease-expo group-hover:-translate-y-1"
        data-cursor="view"
        data-cursor-label="View"
      >
        <TemplateLivePreview
          liveUrl={template.liveUrl}
          accent={template.accent}
          slug={template.slug}
        />
      </Link>

      <div className="mt-5 flex items-center justify-between">
        <span className="eyebrow opacity-70">{categoryLabel(template.category)}</span>
        <span className="eyebrow opacity-70">{template.label}</span>
      </div>

      <h3 className="mt-2 text-xl font-medium">{template.name}</h3>
      <p className="mt-2 text-sm text-muted">{template.shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span>
          {template.price > 0 ? `From $${formatPrice(template.price)}` : "Scope-based"}
        </span>
        {template.pages > 0 && <span>{template.pages} pages</span>}
        <span>{template.timeline}</span>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {template.features.slice(0, 4).map((f) => (
          <li key={f} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-4">
        <Link
          href={`/templates/${template.slug}`}
          className="text-sm text-muted hover:text-ink"
        >
          View Template
        </Link>
        <Link href={startHref} className="text-sm text-accent hover:underline">
          Start With This Design →
        </Link>
      </div>
    </article>
  );
}
