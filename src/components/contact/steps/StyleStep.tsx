"use client";

import { useFormContext } from "react-hook-form";
import {
  type ProjectBriefInput,
  styleDirections,
  themeOptions,
} from "@/lib/project-brief-schema";
import { styleKeywordOptions } from "@/components/contact/project-palettes";
import { ColorPalettePicker } from "@/components/contact/fields/ColorPalettePicker";
import { PageSelector } from "@/components/contact/fields/PageSelector";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm focus:border-accent";

export function StyleStep() {
  const { register, watch } = useFormContext<ProjectBriefInput>();
  const theme = watch("themePreference");

  return (
    <div className="grid gap-8">
      <div>
        <p className="mb-4 text-sm text-muted">Starting color direction</p>
        <ColorPalettePicker />
      </div>

      <div>
        <label htmlFor="styleDirection" className="mb-2 block text-sm text-muted">Overall style</label>
        <select id="styleDirection" className={inputCls} {...register("styleDirection")}>
          <option value="">Select a direction…</option>
          {styleDirections.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <PageSelector name="styleKeywords" options={styleKeywordOptions} label="Style keywords" />

      <fieldset>
        <legend className="mb-3 block text-sm text-muted">Light, dark, or mixed?</legend>
        <div className="flex flex-wrap gap-3">
          {themeOptions.map((option) => {
            const active = theme === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  "cursor-pointer rounded-full border px-5 py-2 text-sm transition-colors",
                  active ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink"
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="sr-only"
                  {...register("themePreference")}
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
