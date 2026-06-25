"use client";

import { useFormContext } from "react-hook-form";
import {
  type ProjectBriefInput,
  projectTypeChoices,
  requiredPagesOptions,
  integrationOptions,
} from "@/lib/project-brief-schema";
import { PageSelector } from "@/components/contact/fields/PageSelector";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm placeholder:text-muted focus:border-accent";

export function ProjectStep() {
  const { register, watch } = useFormContext<ProjectBriefInput>();
  const projectType = watch("projectType");

  return (
    <div className="grid gap-8">
      <fieldset>
        <legend className="mb-3 block text-sm text-muted">What are we building?</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projectTypeChoices.map((choice) => {
            const active = projectType === choice.value;
            return (
              <label
                key={choice.value}
                className={cn(
                  "cursor-pointer rounded-md border p-4 transition-colors",
                  active ? "border-accent bg-[color:var(--accent-soft)]" : "border-line hover:border-ink/30"
                )}
              >
                <input
                  type="radio"
                  value={choice.value}
                  className="sr-only"
                  {...register("projectType")}
                />
                <span className="block font-medium">{choice.label}</span>
                <span className="mt-1 block text-xs text-muted">{choice.hint}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="primaryGoal" className="mb-2 block text-sm text-muted">Main goal for the website</label>
        <input
          id="primaryGoal"
          className={inputCls}
          placeholder="e.g. Generate qualified leads from listings"
          {...register("primaryGoal")}
        />
      </div>

      <PageSelector name="requiredPages" options={requiredPagesOptions} label="Pages you'll need" />
      <PageSelector name="integrations" options={integrationOptions} label="Functionality & integrations" />

      <label className="flex items-center gap-3 text-sm text-muted">
        <input type="checkbox" {...register("needsIdx")} />
        I&apos;ll need IDX / MLS integration (availability varies by market)
      </label>
    </div>
  );
}
