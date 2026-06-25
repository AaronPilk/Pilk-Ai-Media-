"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";
import type { ProjectBriefInput } from "@/lib/project-brief-schema";

const inputCls =
  "w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm placeholder:text-muted focus:border-accent";

export function InspirationUrls() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProjectBriefInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inspirationSites",
  });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <div key={field.id} className="rounded-md border border-line p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Example {index + 1}</span>
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label="Remove example"
              className="rounded-full border border-line p-1.5 text-muted hover:text-ink"
            >
              <X size={14} aria-hidden />
            </button>
          </div>
          <input
            type="url"
            placeholder="https://example.com"
            className={`${inputCls} mt-3`}
            {...register(`inspirationSites.${index}.url` as const)}
          />
          {errors.inspirationSites?.[index]?.url && (
            <p className="mt-1 text-xs text-accent">
              {errors.inspirationSites[index]?.url?.message}
            </p>
          )}
          <input
            type="text"
            placeholder="What do you like about it?"
            className={`${inputCls} mt-3`}
            {...register(`inspirationSites.${index}.note` as const)}
          />
        </div>
      ))}

      {fields.length < 5 && (
        <button
          type="button"
          onClick={() => append({ url: "", note: "" })}
          className="inline-flex items-center gap-2 self-start rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink"
        >
          <Plus size={14} aria-hidden /> Add an example site
        </button>
      )}
    </div>
  );
}
