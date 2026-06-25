"use client";

import { useFormContext } from "react-hook-form";
import type { ProjectBriefInput } from "@/lib/project-brief-schema";
import { templates, templateCategories } from "@/content/templates";
import { FauxBrowser } from "@/components/templates/FauxBrowser";
import { formatPrice, cn } from "@/lib/utils";

function categoryLabel(id: string) {
  return templateCategories.find((c) => c.id === id)?.label ?? "Template";
}

export function TemplateSelector() {
  const { watch, setValue } = useFormContext<ProjectBriefInput>();
  const selected = watch("selectedTemplate");
  const projectType = watch("projectType");

  const choose = (slug: string) => {
    setValue("selectedTemplate", slug, { shouldDirty: true });
    if (projectType === "unsure" || projectType === "custom") {
      setValue("projectType", "template", { shouldDirty: true });
    }
  };

  const chooseCustom = () => {
    setValue("selectedTemplate", "", { shouldDirty: true });
    setValue("projectType", "custom", { shouldDirty: true });
  };

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates
          .filter((t) => t.category !== "custom")
          .map((t) => {
            const isActive = selected === t.slug;
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => choose(t.slug)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-md border p-3 text-left transition-colors",
                  isActive ? "border-accent bg-[color:var(--accent-soft)]" : "border-line hover:border-ink/30"
                )}
              >
                <div className="aspect-[16/10]">
                  <FauxBrowser accent={t.accent} url={`${t.slug}.pilk.ai`} image={t.preview.desktop} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-medium">{t.name}</span>
                  <span className="eyebrow opacity-70">{categoryLabel(t.category)}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {t.price > 0 ? `From $${formatPrice(t.price)}` : "Scope-based"}
                  {t.pages > 0 ? ` · ${t.pages} pages` : ""}
                </p>
              </button>
            );
          })}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={chooseCustom}
          aria-pressed={projectType === "custom"}
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition-colors",
            projectType === "custom" ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink"
          )}
        >
          I want a fully custom design
        </button>
        <button
          type="button"
          onClick={() => setValue("selectedTemplate", "", { shouldDirty: true })}
          className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink"
        >
          Decide later
        </button>
      </div>
    </div>
  );
}
