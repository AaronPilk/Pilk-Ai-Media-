"use client";

import { useFormContext } from "react-hook-form";
import type { ProjectBriefInput } from "@/lib/project-brief-schema";
import { cn } from "@/lib/utils";

type ArrayFieldName = "requiredPages" | "integrations" | "styleKeywords";

/** Generic chip multi-select bound to a string[] form field. */
export function PageSelector({
  name,
  options,
  label,
}: {
  name: ArrayFieldName;
  options: string[];
  label: string;
}) {
  const { watch, setValue } = useFormContext<ProjectBriefInput>();
  const selected = (watch(name) as string[] | undefined) ?? [];

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setValue(name, next, { shouldDirty: true });
  };

  return (
    <fieldset>
      <legend className="mb-3 block text-sm text-muted">{label}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                active ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
