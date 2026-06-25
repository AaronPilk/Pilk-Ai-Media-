import Link from "next/link";
import type { WebsiteTemplate } from "@/types/template";
import { templateCategories } from "@/content/templates";
import { formatPrice } from "@/lib/utils";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

function categoryLabel(id: string) {
  return templateCategories.find((c) => c.id === id)?.label ?? "Template";
}

export function TemplateCard({ template }: { template: WebsiteTemplate }) {
  return (
    <article className="group flex flex-col rounded-md border border-line bg-surface p-4 transition-colors hover:border-ink/30">
      <Link
        href={`/templates/${template.slug}`}
        className="block aspect-[16/10] transition-transform duration-700 ease-expo group-hover:-translate-y-1"
        data-cursor="view"
        data-cursor-label="View"
      >
        <FauxBrowser
          accent={template.accent}
          url={`${template.slug}.pilk.ai`}
          image={template.preview.desktop}
        />
      </Link>

      <div className="mt-5 flex items-center justify-between">
        <span className="eyebrow opacity-70">{categoryLabel(template.category)}</span>
        <span className="eyebrow opacity-70">{template.label}</span>
      </div>

      <h3 className="mt-2 text-xl font-medium">{template.name}</h3>
      <p className="mt-2 text-sm text-muted">{template.shortDescription}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {template.features.slice(0, 3).map((f) => (
          <li key={f} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
        <div>
          <p className="text-sm text-muted">
            {template.price > 0 ? `Starting at $${formatPrice(template.price)}` : "Scope-based"}
          </p>
          {template.pages > 0 && (
            <p className="text-xs text-muted opacity-70">{template.pages} pages</p>
          )}
        </div>
        <div className="flex gap-3 text-sm">
          <Link href={`/templates/${template.slug}`} className="text-muted hover:text-ink">
            Details
          </Link>
          <Link
            href={`/contact?projectType=template&template=${template.slug}`}
            className="text-accent hover:underline"
          >
            Request →
          </Link>
        </div>
      </div>
    </article>
  );
}
