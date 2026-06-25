"use client";

import { useFormContext } from "react-hook-form";
import {
  type ProjectBriefInput,
  budgetOptions,
  timelineOptions,
} from "@/lib/project-brief-schema";

const inputCls =
  "w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm focus:border-accent";

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-6 border-b border-line py-2.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

export function ReviewStep({ files }: { files: File[] }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ProjectBriefInput>();
  const v = watch();

  return (
    <div className="grid gap-8">
      <div className="rounded-md border border-line bg-surface-2 p-6">
        <h3 className="mb-3 text-lg font-medium">Your brief so far</h3>
        <Row label="Name" value={[v.firstName, v.lastName].filter(Boolean).join(" ")} />
        <Row label="Email" value={v.email} />
        <Row label="Phone" value={v.phone || undefined} />
        <Row label="Company" value={v.company || undefined} />
        <Row label="Project type" value={v.projectType} />
        <Row label="Template" value={v.selectedTemplate || undefined} />
        <Row label="Goal" value={v.primaryGoal || undefined} />
        <Row label="Pages" value={v.requiredPages?.join(", ")} />
        <Row label="Integrations" value={v.integrations?.join(", ")} />
        <Row label="Palette" value={v.selectedPalette || undefined} />
        <Row label="Colors" value={v.preferredColors?.join("  ")} />
        <Row label="Style" value={v.styleDirection || undefined} />
        <Row label="Theme" value={v.themePreference || undefined} />
        <Row label="Inspiration sites" value={v.inspirationSites?.length ? `${v.inspirationSites.length}` : undefined} />
        <Row label="Files" value={files.length ? `${files.length} attached` : undefined} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="budget" className="mb-2 block text-sm text-muted">Estimated budget</label>
          <select id="budget" className={inputCls} {...register("budget")}>
            <option value="">Select…</option>
            {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className="mb-2 block text-sm text-muted">Desired launch</label>
          <select id="timeline" className={inputCls} {...register("timeline")}>
            <option value="">Select…</option>
            {timelineOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="preferredContact" className="mb-2 block text-sm text-muted">Preferred contact</label>
        <select id="preferredContact" className={inputCls} {...register("preferredContact")}>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="text">Text</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-muted">Anything else?</label>
        <textarea id="message" rows={4} className={inputCls} {...register("message")} />
      </div>

      <label className="flex items-start gap-3 text-xs text-muted">
        <input type="checkbox" className="mt-0.5" {...register("consent")} />
        I agree to be contacted about my website project.
      </label>
      {errors.consent && <p className="-mt-4 text-xs text-accent">{errors.consent.message}</p>}
    </div>
  );
}
