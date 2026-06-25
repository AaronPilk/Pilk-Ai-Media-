"use client";

import { templateCategories } from "@/content/templates";
import type { TemplateCategory } from "@/types/template";
import { cn } from "@/lib/utils";

export type FilterValue = TemplateCategory | "all";

export function TemplateFilters({
  active,
  onChange,
}: {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filter templates">
      {templateCategories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.id as FilterValue)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              isActive
                ? "border-accent bg-accent text-white"
                : "border-line text-muted hover:border-ink/40 hover:text-ink"
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
