"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/forms";
import { useUTMParameters } from "@/hooks/useUTMParameters";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { ProjectTypeFields } from "@/components/contact/ProjectTypeFields";
import { ContactSuccess } from "@/components/contact/ContactSuccess";

const inputCls =
  "w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm placeholder:text-muted focus:border-accent";

const industries = [
  "Real Estate",
  "Mortgage",
  "Title",
  "Local Business",
  "Other",
];

export function ContactForm({ realEstate = false }: { realEstate?: boolean }) {
  const params = useSearchParams();
  const attribution = useUTMParameters();
  const startedRef = useRef(false);

  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [hasCurrentSite, setHasCurrentSite] = useState(false);

  const qpProjectType = params.get("projectType") as LeadInput["projectType"] | null;
  const qpTemplate = params.get("template") ?? "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      projectType: qpProjectType ?? (realEstate ? "template" : "unsure"),
      selectedTemplate: qpTemplate,
      industry: realEstate ? "Real Estate" : "",
      needsIdx: false,
      consent: false,
      honeypot: "",
    },
  });

  useEffect(() => {
    setValue("utmSource", attribution.utmSource);
    setValue("utmMedium", attribution.utmMedium);
    setValue("utmCampaign", attribution.utmCampaign);
    setValue("utmContent", attribution.utmContent);
    setValue("utmTerm", attribution.utmTerm);
    setValue("landingPage", attribution.landingPage);
    setValue("referrer", attribution.referrer);
    setValue("gclid", attribution.gclid);
    setValue("fbclid", attribution.fbclid);
  }, [attribution, setValue]);

  const projectType = watch("projectType");
  const industry = watch("industry");
  const firstName = watch("firstName");
  const showCurrentSite = hasCurrentSite || projectType === "redesign";
  const showIdx = realEstate || industry === "Real Estate";

  const onStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("contact_form_started");
  };

  const onSubmit = async (data: LeadInput) => {
    setServerError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Something went wrong. Please try again.");
        trackEvent("contact_form_error");
        return;
      }
      trackEvent("contact_form_submitted", { projectType: data.projectType });
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please try again.");
      trackEvent("contact_form_error");
    }
  };

  if (submitted) return <ContactSuccess firstName={firstName} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={onStart} noValidate className="grid gap-5">
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        {...register("honeypot")}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

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
          <label htmlFor="company" className="mb-2 block text-sm text-muted">Company / brokerage</label>
          <input id="company" className={inputCls} {...register("company")} />
        </div>
        <div>
          <label htmlFor="industry" className="mb-2 block text-sm text-muted">Industry</label>
          <select id="industry" className={inputCls} {...register("industry")}>
            <option value="">Select…</option>
            {industries.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <ProjectTypeFields register={register} errors={errors} />
        <div>
          <label htmlFor="budget" className="mb-2 block text-sm text-muted">Estimated budget</label>
          <select id="budget" className={inputCls} {...register("budget")}>
            <option value="">Select…</option>
            <option>Under $1,000</option>
            <option>$1,000–$2,500</option>
            <option>$2,500–$5,000</option>
            <option>$5,000+</option>
          </select>
        </div>
      </div>

      {qpTemplate && (
        <div className="rounded-sm border border-accent/40 bg-[color:var(--accent-soft)] px-4 py-3 text-sm">
          Selected template: <strong>{qpTemplate}</strong>
        </div>
      )}
      <input type="hidden" {...register("selectedTemplate")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="timeline" className="mb-2 block text-sm text-muted">Desired launch</label>
          <select id="timeline" className={inputCls} {...register("timeline")}>
            <option value="">Select…</option>
            <option>As soon as possible</option>
            <option>2–4 weeks</option>
            <option>1–2 months</option>
            <option>Flexible</option>
          </select>
        </div>
        <div>
          <label htmlFor="preferredContact" className="mb-2 block text-sm text-muted">Preferred contact</label>
          <select id="preferredContact" className={inputCls} {...register("preferredContact")}>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="text">Text</option>
          </select>
        </div>
      </div>

      {/* Conditional: current website */}
      {!showCurrentSite ? (
        <label className="flex items-center gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={hasCurrentSite}
            onChange={(e) => setHasCurrentSite(e.target.checked)}
          />
          I have a current website
        </label>
      ) : (
        <div>
          <label htmlFor="currentWebsite" className="mb-2 block text-sm text-muted">Current website URL</label>
          <input
            id="currentWebsite"
            type="url"
            placeholder="https://"
            className={inputCls}
            {...register("currentWebsite")}
          />
          {errors.currentWebsite && (
            <p className="mt-1 text-xs text-accent">{errors.currentWebsite.message}</p>
          )}
        </div>
      )}

      {/* Conditional: IDX/MLS for real estate */}
      {showIdx && (
        <label className="flex items-center gap-3 text-sm text-muted">
          <input type="checkbox" {...register("needsIdx")} />
          I&apos;ll need IDX / MLS integration (availability varies by market)
        </label>
      )}

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-muted">
          {projectType === "custom" ? "Project scope & details" : "Project details"}
        </label>
        <textarea
          id="message"
          rows={5}
          className={inputCls}
          placeholder={
            projectType === "custom"
              ? "Tell us about the business, goals, pages, and any integrations…"
              : "Tell us about your business and what you need…"
          }
          {...register("message")}
        />
        {errors.message && <p className="mt-1 text-xs text-accent">{errors.message.message}</p>}
      </div>

      <label className="flex items-start gap-3 text-xs text-muted">
        <input type="checkbox" {...register("consent")} className="mt-0.5" />
        I agree to be contacted about my inquiry.
      </label>

      {serverError && (
        <p role="alert" className="rounded-sm border border-accent/40 bg-[color:var(--accent-soft)] px-4 py-3 text-sm">
          {serverError}
        </p>
      )}

      <div>
        <Button type="submit" variant="primary" withArrow>
          {isSubmitting ? "Sending…" : "Send inquiry"}
        </Button>
      </div>
    </form>
  );
}
