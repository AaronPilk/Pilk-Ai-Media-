"use client";

import { useFormContext } from "react-hook-form";
import type { ProjectBriefInput } from "@/lib/project-brief-schema";

const inputCls =
  "w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm placeholder:text-muted focus:border-accent";

export function BusinessStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProjectBriefInput>();

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-2 block text-sm text-muted">First name</label>
          <input id="firstName" className={inputCls} {...register("firstName")} />
          {errors.firstName && <p className="mt-1 text-xs text-accent">Required</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="mb-2 block text-sm text-muted">Last name</label>
          <input id="lastName" className={inputCls} {...register("lastName")} />
          {errors.lastName && <p className="mt-1 text-xs text-accent">Required</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-muted">Email</label>
          <input id="email" type="email" className={inputCls} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-accent">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm text-muted">Phone (optional)</label>
          <input id="phone" type="tel" className={inputCls} {...register("phone")} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-2 block text-sm text-muted">Company or brand</label>
          <input id="company" className={inputCls} {...register("company")} />
        </div>
        <div>
          <label htmlFor="industry" className="mb-2 block text-sm text-muted">Industry</label>
          <input id="industry" className={inputCls} placeholder="e.g. Real estate" {...register("industry")} />
        </div>
      </div>

      <div>
        <label htmlFor="currentWebsite" className="mb-2 block text-sm text-muted">Current website (optional)</label>
        <input id="currentWebsite" type="url" placeholder="https://" className={inputCls} {...register("currentWebsite")} />
        {errors.currentWebsite && <p className="mt-1 text-xs text-accent">{errors.currentWebsite.message}</p>}
      </div>

      <div>
        <label htmlFor="businessDescription" className="mb-2 block text-sm text-muted">Short business description</label>
        <textarea
          id="businessDescription"
          rows={3}
          className={inputCls}
          placeholder="What does your business do?"
          {...register("businessDescription")}
        />
        {errors.businessDescription && (
          <p className="mt-1 text-xs text-accent">{errors.businessDescription.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="targetAudience" className="mb-2 block text-sm text-muted">Who&apos;s your ideal customer? (optional)</label>
        <input id="targetAudience" className={inputCls} {...register("targetAudience")} />
      </div>
    </div>
  );
}
