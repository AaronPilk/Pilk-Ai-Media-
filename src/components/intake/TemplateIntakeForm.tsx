"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  templateIntakeSchema,
  type TemplateIntakeInput,
  intakeUploadGroups,
  INTAKE_MAX_FILES,
  INTAKE_MAX_TOTAL_SIZE,
} from "@/lib/template-intake-schema";
import { useUTMParameters } from "@/hooks/useUTMParameters";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

const inputCls =
  "w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm placeholder:text-muted focus:border-accent";
const labelCls = "mb-2 block text-sm text-muted";

function Field({
  id,
  label,
  hint,
  children,
  error,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
        {hint && <span className="ml-2 text-xs opacity-70">{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}

export function TemplateIntakeForm({
  templateSlug,
  templateName,
}: {
  templateSlug: string;
  templateName: string;
}) {
  const attribution = useUTMParameters();
  const startedRef = useRef(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [colorText, setColorText] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TemplateIntakeInput>({
    resolver: zodResolver(templateIntakeSchema),
    defaultValues: {
      templateSlug,
      templateName,
      consent: false,
      honeypot: "",
    },
  });

  useEffect(() => {
    setValue("templateSlug", templateSlug);
    setValue("templateName", templateName);
    setValue("utmSource", attribution.utmSource);
    setValue("utmMedium", attribution.utmMedium);
    setValue("utmCampaign", attribution.utmCampaign);
    setValue("landingPage", attribution.landingPage);
    setValue("referrer", attribution.referrer);
  }, [attribution, setValue, templateSlug, templateName]);

  // Parse hex colors from free text into the schema array.
  useEffect(() => {
    const hexes = (colorText.match(/#[0-9a-fA-F]{6}/g) ?? []).slice(0, 6);
    setValue("brandColors", hexes);
  }, [colorText, setValue]);

  const allFiles = useMemo(() => Object.values(files).flat(), [files]);
  const totalBytes = allFiles.reduce((s, f) => s + f.size, 0);
  const fileCountError =
    allFiles.length > INTAKE_MAX_FILES
      ? `Please upload no more than ${INTAKE_MAX_FILES} files.`
      : totalBytes > INTAKE_MAX_TOTAL_SIZE
        ? "Your files total more than 20 MB. Compress them or send the largest separately."
        : "";

  const onStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("template_intake_started", { template: templateSlug });
  };

  const onSubmit = async (data: TemplateIntakeInput) => {
    setServerError("");
    if (fileCountError) {
      setServerError(fileCountError);
      return;
    }
    try {
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      for (const group of Object.keys(files)) {
        for (const file of files[group]) fd.append(group, file, file.name);
      }
      const res = await fetch("/api/template-intake", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Something went wrong. Please try again.");
        trackEvent("template_intake_error", { template: templateSlug });
        return;
      }
      trackEvent("template_intake_submitted", { template: templateSlug });
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please try again.");
      trackEvent("template_intake_error", { template: templateSlug });
    }
  };

  if (submitted) {
    return (
      <div className="rounded-md border border-accent/40 bg-[color:var(--accent-soft)] p-8">
        <h2 className="text-2xl font-medium">You&apos;re all set 🎉</h2>
        <p className="mt-3 max-w-lg text-muted">
          We&apos;ve got your <strong>{templateName}</strong> order and your files. We&apos;ll
          build your site with your content and be in touch shortly. Check your email for a
          confirmation.
        </p>
      </div>
    );
  }

  const sectionCls = "rounded-md border border-line bg-surface p-6 sm:p-8";
  const sectionTitle = "text-lg font-medium";

  return (
    <form onSubmit={handleSubmit(onSubmit)} onFocus={onStart} noValidate className="grid gap-6">
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        {...register("honeypot")}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      {/* Your details */}
      <fieldset className={sectionCls}>
        <legend className={sectionTitle}>Your details</legend>
        <p className="mb-5 mt-1 text-sm text-muted">So we can reach you about your build.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="yourName" label="Your name" error={errors.yourName && "Required"}>
            <input id="yourName" className={inputCls} {...register("yourName")} />
          </Field>
          <Field id="email" label="Email" error={errors.email?.message}>
            <input id="email" type="email" className={inputCls} {...register("email")} />
          </Field>
          <Field id="phone" label="Phone (optional)">
            <input id="phone" type="tel" className={inputCls} {...register("phone")} />
          </Field>
        </div>
      </fieldset>

      {/* Brand */}
      <fieldset className={sectionCls}>
        <legend className={sectionTitle}>Your brand</legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field id="businessName" label="Business name" error={errors.businessName && "Required"}>
            <input id="businessName" className={inputCls} {...register("businessName")} />
          </Field>
          <Field id="agentTitle" label="Title / role" hint="e.g. REALTOR®, Tampa Bay">
            <input id="agentTitle" className={inputCls} {...register("agentTitle")} />
          </Field>
          <Field id="tagline" label="Tagline / slogan (optional)">
            <input id="tagline" className={inputCls} {...register("tagline")} />
          </Field>
          <Field id="brandColors" label="Brand colors (optional)" hint="hex, e.g. #1f6feb #16151a">
            <input
              id="brandColors"
              className={inputCls}
              placeholder="#1f6feb #16151a"
              value={colorText}
              onChange={(e) => setColorText(e.target.value)}
            />
          </Field>
        </div>
      </fieldset>

      {/* Headline copy */}
      <fieldset className={sectionCls}>
        <legend className={sectionTitle}>Headline &amp; about</legend>
        <p className="mb-5 mt-1 text-sm text-muted">
          Leave blank and we&apos;ll write strong copy for you — or give us your own.
        </p>
        <div className="grid gap-5">
          <Field id="heroHeadline" label="Hero headline (optional)" hint="the big line at the top">
            <input id="heroHeadline" className={inputCls} {...register("heroHeadline")} />
          </Field>
          <Field id="heroSubtext" label="Hero subtext (optional)">
            <textarea id="heroSubtext" rows={2} className={inputCls} {...register("heroSubtext")} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="ctaText" label="Button text (optional)" hint="e.g. Book a call">
              <input id="ctaText" className={inputCls} {...register("ctaText")} />
            </Field>
            <Field id="aboutHeadline" label="About headline (optional)">
              <input id="aboutHeadline" className={inputCls} {...register("aboutHeadline")} />
            </Field>
          </div>
          <Field id="aboutBody" label="About you (optional)" hint="a short bio / who you are">
            <textarea id="aboutBody" rows={4} className={inputCls} {...register("aboutBody")} />
          </Field>
        </div>
      </fieldset>

      {/* Content */}
      <fieldset className={sectionCls}>
        <legend className={sectionTitle}>Your content</legend>
        <p className="mb-5 mt-1 text-sm text-muted">One item per line. Skip anything that doesn&apos;t apply.</p>
        <div className="grid gap-5">
          <Field
            id="servicesText"
            label="Services / why choose you"
            hint="Title | short description — one per line"
          >
            <textarea id="servicesText" rows={4} className={inputCls} placeholder={"Sharp marketing | Every listing gets pro media and paid promotion\nStraight answers | Fast, honest communication at every step"} {...register("servicesText")} />
          </Field>
          <Field
            id="listingsText"
            label="Featured listings / items (optional)"
            hint="Address | Price | Beds/Baths/SqFt | description — one per line"
          >
            <textarea id="listingsText" rows={4} className={inputCls} placeholder={"412 Bayshore Blvd, Tampa | $725,000 | 4 bd / 3 ba / 2,840 sqft | Waterfront stunner"} {...register("listingsText")} />
          </Field>
          <Field
            id="testimonialsText"
            label="Testimonials (optional)"
            hint={'"Quote" — Name — one per line'}
          >
            <textarea id="testimonialsText" rows={3} className={inputCls} placeholder={'"Sold our home in 9 days, over asking." — The Hendersons'} {...register("testimonialsText")} />
          </Field>
        </div>
      </fieldset>

      {/* Contact info to display */}
      <fieldset className={sectionCls}>
        <legend className={sectionTitle}>Contact info to show on the site</legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field id="displayPhone" label="Display phone (optional)">
            <input id="displayPhone" className={inputCls} {...register("displayPhone")} />
          </Field>
          <Field id="displayEmail" label="Display email (optional)" error={errors.displayEmail?.message}>
            <input id="displayEmail" className={inputCls} {...register("displayEmail")} />
          </Field>
          <Field id="address" label="Address (optional)">
            <input id="address" className={inputCls} {...register("address")} />
          </Field>
          <Field id="serviceArea" label="Service area (optional)" hint="e.g. Greater Tampa Bay">
            <input id="serviceArea" className={inputCls} {...register("serviceArea")} />
          </Field>
          <Field id="website" label="Website (optional)" error={errors.website?.message}>
            <input id="website" type="url" placeholder="https://" className={inputCls} {...register("website")} />
          </Field>
          <Field id="instagram" label="Instagram (optional)">
            <input id="instagram" className={inputCls} placeholder="@handle or link" {...register("instagram")} />
          </Field>
          <Field id="facebook" label="Facebook (optional)">
            <input id="facebook" className={inputCls} {...register("facebook")} />
          </Field>
          <Field id="linkedin" label="LinkedIn (optional)">
            <input id="linkedin" className={inputCls} {...register("linkedin")} />
          </Field>
        </div>
      </fieldset>

      {/* Uploads */}
      <fieldset className={sectionCls}>
        <legend className={sectionTitle}>Upload your assets</legend>
        <p className="mb-5 mt-1 text-sm text-muted">
          Images & PDFs · up to {INTAKE_MAX_FILES} files · 20 MB total. The more you give us, the
          closer your first draft will be.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {intakeUploadGroups.map((g) => (
            <Field key={g.field} id={`file-${g.field}`} label={g.label} hint={g.hint}>
              <input
                id={`file-${g.field}`}
                type="file"
                multiple={g.multiple}
                accept="image/*,application/pdf"
                className="block w-full text-sm text-muted file:mr-4 file:rounded-sm file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:text-white"
                onChange={(e) =>
                  setFiles((prev) => ({ ...prev, [g.field]: Array.from(e.target.files ?? []) }))
                }
              />
              {(files[g.field]?.length ?? 0) > 0 && (
                <p className="mt-1 text-xs text-muted">
                  {files[g.field].map((f) => f.name).join(", ")}
                </p>
              )}
            </Field>
          ))}
        </div>
        <Field id="fileNotes" label="Notes about your files (optional)">
          <textarea
            id="fileNotes"
            rows={2}
            className={`${inputCls} mt-4`}
            placeholder="e.g. Use the third photo as the hero. Logo should be white version."
            {...register("fileNotes")}
          />
        </Field>
        {allFiles.length > 0 && (
          <p className={`mt-3 text-xs ${fileCountError ? "text-accent" : "text-muted"}`}>
            {allFiles.length} file{allFiles.length === 1 ? "" : "s"} · {Math.round(totalBytes / 1024 / 1024 * 10) / 10} MB
            {fileCountError && ` — ${fileCountError}`}
          </p>
        )}
      </fieldset>

      {/* Notes */}
      <fieldset className={sectionCls}>
        <legend className={sectionTitle}>Anything else</legend>
        <Field id="notes" label="Notes for our team (optional)">
          <textarea id="notes" rows={4} className={`${inputCls} mt-4`} {...register("notes")} />
        </Field>
      </fieldset>

      <label className="flex items-start gap-3 text-xs text-muted">
        <input type="checkbox" {...register("consent")} className="mt-0.5" />
        I agree to be contacted about my project.
      </label>
      {errors.consent && <p className="-mt-3 text-xs text-accent">{errors.consent.message}</p>}

      {serverError && (
        <p role="alert" className="rounded-sm border border-accent/40 bg-[color:var(--accent-soft)] px-4 py-3 text-sm">
          {serverError}
        </p>
      )}

      <div>
        <Button type="submit" variant="primary" withArrow>
          {isSubmitting ? "Sending…" : "Submit my template order"}
        </Button>
      </div>
    </form>
  );
}
