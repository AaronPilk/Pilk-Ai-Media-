"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { LeadInput } from "@/lib/forms";
import { projectTypeOptions } from "@/lib/forms";

export function ProjectTypeFields({
  register,
  errors,
}: {
  register: UseFormRegister<LeadInput>;
  errors: FieldErrors<LeadInput>;
}) {
  return (
    <div>
      <label htmlFor="projectType" className="mb-2 block text-sm text-muted">
        What are you after?
      </label>
      <select
        id="projectType"
        {...register("projectType")}
        className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm"
      >
        {projectTypeOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {errors.projectType && (
        <p className="mt-1 text-xs text-accent">Please choose an option.</p>
      )}
    </div>
  );
}
