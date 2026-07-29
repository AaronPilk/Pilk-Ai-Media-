"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ChipSingle, ChipMulti } from "./Chips";
import { UploadDropzone, type UploadItem } from "./UploadDropzone";
import { templateIntakeSchema, type TemplateIntakeInput } from "@/lib/template-intake-schema";
import { formatPhone } from "@/lib/intake-helpers";
import { getTemplate } from "@/content/templates";
import { useUTMParameters } from "@/hooks/useUTMParameters";
import { trackEvent } from "@/lib/analytics";

const inputCls =
  "w-full rounded-sm border border-line bg-surface px-4 py-3.5 text-base sm:text-sm placeholder:text-muted focus:border-accent";
const STORAGE_KEY = "pilk_intake_v2";

const ROLE_OPTIONS = [
  { value: "mortgage", label: "Mortgage / loans" },
  { value: "realestate", label: "Real estate agent" },
  { value: "both", label: "Both" },
  { value: "other", label: "Something else" },
];
const STARTERS: Record<string, string[]> = {
  mortgage: [
    "I help first-time buyers get approved fast.",
    "I make refinancing simple and clear.",
    "I find the right loan for every budget.",
  ],
  realestate: [
    "I help families find their next home.",
    "I get homes sold for top dollar.",
    "I make buying and selling stress-free.",
  ],
};
const SERVICE_PRESETS = [
  "Home Purchase", "Refinance", "First-Time Buyers", "VA Loans", "FHA",
  "Jumbo", "Investment Property", "Pre-Approval", "Buyer's Agent", "Listing Agent",
];
const PROGRESS: Record<number, number> = { 1: 15, 2: 45, 3: 75, 4: 100 };
const STEP_TITLES = ["", "You", "Your business", "Your photos", "Last thing"];

function Field({
  id, label, hint, error, children,
}: {
  id?: string; label: string; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {hint && <span className="ml-2 text-xs font-normal text-muted">{hint}</span>}
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
  const router = useRouter();
  const attribution = useUTMParameters();
  const category = getTemplate(templateSlug)?.category;
  const roleFromTemplate: TemplateIntakeInput["doWhat"] =
    category === "mortgage" ? "mortgage" : category && category !== "custom" ? "realestate" : undefined;

  const [step, setStep] = useState(1);
  const [logoItems, setLogoItems] = useState<UploadItem[]>([]);
  const [mediaItems, setMediaItems] = useState<UploadItem[]>([]);
  const [uploadError, setUploadError] = useState<string>();
  const [sendLater, setSendLater] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [linkRows, setLinkRows] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [resumed, setResumed] = useState(false);

  const {
    register, handleSubmit, control, watch, setValue, getValues, trigger,
    formState: { errors },
  } = useForm<TemplateIntakeInput>({
    resolver: zodResolver(templateIntakeSchema),
    mode: "onBlur",
    defaultValues: {
      templateSlug,
      templateName,
      doWhat: roleFromTemplate,
      services: [],
      useAccountPhone: true,
      useAccountEmail: true,
      honeypot: "",
      consent: undefined as unknown as true,
    },
  });

  // localStorage resume (mobile users leave to grab a photo)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        Object.entries(saved.values || {}).forEach(([k, v]) =>
          setValue(k as keyof TemplateIntakeInput, v as never)
        );
        if (Array.isArray(saved.linkRows) && saved.linkRows.length) setLinkRows(saved.linkRows);
        setResumed(true);
      }
    } catch { /* ignore */ }
  }, [setValue]);

  useEffect(() => {
    const sub = watch((values) => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ values, linkRows })); } catch { /* ignore */ }
    });
    return () => sub.unsubscribe();
  }, [watch, linkRows]);

  const startOver = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    window.location.reload();
  };

  const goNext = async () => {
    setSubmitError(undefined);
    if (step === 1) {
      const ok = await trigger(["name", "email", "businessName"]);
      if (!ok) return;
      trackEvent("template_intake_started", { template: templateSlug });
    }
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    setSubmitError(undefined);
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: TemplateIntakeInput) => {
    setSubmitError(undefined);
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        templateSlug,
        templateName,
        links: linkRows.map((r) => r.trim()).filter(Boolean),
        sendPhotosLater: sendLater,
        utmSource: attribution.utmSource,
        utmMedium: attribution.utmMedium,
        utmCampaign: attribution.utmCampaign,
        landingPage: attribution.landingPage,
        referrer: attribution.referrer,
      };
      const fd = new FormData();
      fd.append("payload", JSON.stringify(payload));
      logoItems.forEach((i) => fd.append("logo", i.file, i.file.name));
      mediaItems.forEach((i) => fd.append("gallery", i.file, i.file.name));

      const res = await fetch("/api/template-intake", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Something went wrong.");
      }
      trackEvent("template_intake_submitted", { template: templateSlug });
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      router.push(`/checkout?template=${encodeURIComponent(templateSlug)}`);
    } catch (e: unknown) {
      trackEvent("template_intake_error", { template: templateSlug });
      setSubmitError(
        (e instanceof Error && e.message) ||
          "We couldn't save that just now. Your answers are still here — tap to try again."
      );
      setSubmitting(false);
    }
  };

  const role = watch("doWhat");
  const isMortgage = role === "mortgage" || role === "both";
  const totalFiles = logoItems.length + mediaItems.length;
  const reviewName = watch("name");
  const reviewEmail = watch("email");
  const reviewBiz = watch("businessName");
  const photoCount = useMemo(() => logoItems.length + mediaItems.length, [logoItems, mediaItems]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex min-h-[70vh] max-w-lg flex-col">
      {/* honeypot */}
      <input
        type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" {...register("honeypot")}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      {/* progress */}
      <div className="pb-2">
        <div className="h-1 w-full overflow-hidden rounded-sm bg-line">
          <div className="h-full rounded-sm bg-accent transition-all duration-300" style={{ width: `${PROGRESS[step]}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted">{`Step ${step} of 4 · ${STEP_TITLES[step]}`}</p>
        {step <= 2 && (
          <p className="mt-1 text-xs text-muted">
            Only 3 things are required. Everything else is optional — we&apos;ll fill in the rest.
          </p>
        )}
        {resumed && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted">Welcome back — we saved your spot.</span>
            <button type="button" onClick={startOver} className="text-accent underline">Not you? Start over</button>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-5 py-4">
        {step === 1 && (
          <>
            <header>
              <h1 className="text-xl font-semibold text-ink">Let&apos;s build your site.</h1>
              <p className="mt-1 text-sm text-muted">Three quick things to get started. Most people finish in about 2 minutes.</p>
            </header>
            <Field id="name" label="Your name" hint="First and last is perfect." error={errors.name?.message}>
              <input id="name" className={inputCls} placeholder="Maria Lopez" autoComplete="name" autoCapitalize="words" {...register("name")} />
            </Field>
            <Field id="email" label="Best email" hint="We'll send your site preview here." error={errors.email?.message}>
              <input id="email" type="email" inputMode="email" autoCapitalize="off" autoComplete="email" className={inputCls} placeholder="you@email.com" {...register("email")} />
            </Field>
            <Field id="businessName" label="Business name" hint="Your name or team name. Not sure yet? Use your own name." error={errors.businessName?.message}>
              <input id="businessName" className={inputCls} placeholder="Lopez Home Loans" autoCapitalize="words" {...register("businessName")} />
            </Field>
            <Field id="phone" label="Cell phone" hint="Optional — only so we can text you a quick question.">
              <Controller control={control} name="phone" render={({ field }) => (
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" className={inputCls} placeholder="(555) 123-4567"
                  value={field.value ?? ""} onChange={(e) => field.onChange(formatPhone(e.target.value))} />
              )} />
            </Field>
            <p className="text-xs text-muted">Your info is only used to build your site.</p>
          </>
        )}

        {step === 2 && (
          <>
            <header>
              <h1 className="text-xl font-semibold text-ink">Tell us about your business.</h1>
              <p className="mt-1 text-sm text-muted">All optional. Skip anything — we&apos;ll write it for you or use a clean placeholder.</p>
            </header>
            <Field label="What do you do?" hint="Pick the one that fits. It just helps us word your site.">
              <Controller control={control} name="doWhat" render={({ field }) => (
                <ChipSingle options={ROLE_OPTIONS} value={field.value} onChange={field.onChange} />
              )} />
            </Field>
            {role === "other" && (
              <input className={inputCls} placeholder="e.g. Title &amp; escrow, insurance…" {...register("doWhatOther")} />
            )}
            {isMortgage && (
              <Field id="nmls" label="Your NMLS #" hint="Required by law on mortgage sites — add now or we'll ask before launch.">
                <input id="nmls" className={inputCls} placeholder="NMLS #1234567" {...register("nmls")} />
              </Field>
            )}
            <Field id="serviceArea" label="Where do you work?" hint="City or area you serve. We'll show it so local clients find you.">
              <input id="serviceArea" className={inputCls} placeholder="Phoenix, AZ and nearby" {...register("serviceArea")} />
            </Field>
            <Field id="about" label="One line about what you do" hint="Leave blank and we'll write your headline and bio for you.">
              <textarea id="about" rows={2} className={inputCls} placeholder="I help first-time buyers in Dallas get approved fast." {...register("about")} />
              {(role === "mortgage" || role === "realestate") && (
                <div className="mt-2">
                  <p className="text-xs text-muted">Or start from one of these — tap to use, then edit:</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {STARTERS[role].map((s) => (
                      <button type="button" key={s} onClick={() => setValue("about", s)}
                        className="rounded-sm border border-line bg-surface px-3 py-2 text-left text-xs text-ink hover:border-accent/50">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Field>
            <Field label="What you offer" hint="Tap what you offer. Not sure? Skip — we'll show sensible defaults.">
              <Controller control={control} name="services" render={({ field }) => (
                <ChipMulti options={SERVICE_PRESETS} value={field.value ?? []}
                  onToggle={(v) => {
                    const cur = field.value ?? [];
                    field.onChange(cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
                  }} />
              )} />
            </Field>
            <div>
              <p className="text-sm font-medium text-ink">Your website or social pages</p>
              <p className="mb-2 text-xs text-muted">Paste any links — we&apos;ll take a look for photos and details we can use.</p>
              <div className="space-y-2">
                {linkRows.map((val, idx) => (
                  <input key={idx} className={inputCls} type="url" inputMode="url" autoCapitalize="off" autoCorrect="off"
                    placeholder={["yourwebsite.com", "facebook.com/yourpage", "instagram.com/you"][idx] ?? "another link"}
                    value={val} onChange={(e) => setLinkRows((rows) => rows.map((r, i) => (i === idx ? e.target.value : r)))} />
                ))}
              </div>
              {linkRows.length < 3 && (
                <button type="button" onClick={() => setLinkRows((r) => [...r, ""])} className="mt-2 text-sm text-accent">+ Add another link</button>
              )}
            </div>
            <button type="button" onClick={() => setShowContact((v) => !v)} className="text-sm text-accent">
              + Add title &amp; a different display email (optional)
            </button>
            {showContact && (
              <div className="space-y-4 rounded-sm border border-line p-4">
                <Field id="title" label="Your title" hint="Optional.">
                  <input id="title" className={inputCls} placeholder="Senior Loan Officer" {...register("title")} />
                </Field>
                <label className="flex min-h-[44px] items-center gap-2 text-sm text-ink">
                  <input type="checkbox" className="h-5 w-5" {...register("useAccountEmail")} />
                  Show the email I already gave you
                </label>
                {!watch("useAccountEmail") && (
                  <input className={inputCls} type="email" placeholder="you@email.com" {...register("displayEmail")} />
                )}
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <header>
              <h1 className="text-xl font-semibold text-ink">Add your photos.</h1>
              <p className="mt-1 text-sm text-muted">All optional. Add what&apos;s handy — or send them later, no problem.</p>
            </header>
            {sendLater ? (
              <div className="rounded-sm bg-[color:var(--accent-soft)] p-4 text-sm text-ink">
                Got it — we&apos;ll start with clean placeholders and email you an easy link to add photos anytime.
                <button type="button" className="mt-2 block text-accent underline" onClick={() => setSendLater(false)}>Actually, I&apos;ll add some now</button>
              </div>
            ) : (
              <>
                <div className="rounded-sm border border-line bg-surface p-4">
                  <p className="mb-2 text-sm text-ink">Don&apos;t have your photos on this phone right now?</p>
                  <Button variant="ghost" onClick={() => setSendLater(true)}>Send them later — one tap</Button>
                </div>
                <div className="rounded-sm bg-[color:var(--accent-soft)] p-4 text-sm text-ink">
                  Upload whatever you have from your camera roll — photos or PDFs. We&apos;ll crop, size, and clean them up. You don&apos;t need to format anything.
                </div>
                <UploadDropzone title="Your logo"
                  helper="The logo you use on business cards or emails — a clear picture of just the logo."
                  skipLine="No logo? Skip it — we'll set your name in a clean style."
                  items={logoItems} onItemsChange={setLogoItems} onSoftError={setUploadError} error={uploadError} />
                <UploadDropzone title="Everything else" multiple
                  helper="A photo of you, your listings, your office, your city, a brand guide — drop it all in."
                  skipLine="Nothing to add? Skip — you can send these later."
                  items={mediaItems} onItemsChange={setMediaItems} onSoftError={setUploadError} error={uploadError} />
                <p className="text-xs text-muted">Photos or PDFs, up to 14 files.{totalFiles > 0 ? ` · ${totalFiles} added` : ""}</p>
              </>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <header>
              <h1 className="text-xl font-semibold text-ink">Last step.</h1>
              <p className="mt-1 text-sm text-muted">Anything special we should know? All optional except the box at the bottom.</p>
            </header>
            <Field id="notes" label="Notes for our build team" hint="Optional.">
              <textarea id="notes" rows={3} className={inputCls} placeholder={'e.g. "I love clean, modern sites" or "match my competitor\'s vibe."'} {...register("notes")} />
            </Field>
            <div className="rounded-sm border border-line p-4 text-sm">
              <p className="font-medium text-ink">Here&apos;s what we&apos;ve got:</p>
              <ul className="mt-2 space-y-1 text-ink">
                <li>✓ {reviewName || "—"} · {reviewEmail || "—"} · {reviewBiz || "—"}
                  <button type="button" onClick={() => setStep(1)} className="ml-2 text-accent underline">Edit</button>
                </li>
                <li>
                  {photoCount > 0 ? `✓ ${photoCount} photo${photoCount === 1 ? "" : "s"} added` : "No photos yet — we'll use clean placeholders and email you a link to add them."}
                  <button type="button" onClick={() => setStep(3)} className="ml-2 text-accent underline">Edit</button>
                </li>
              </ul>
              <p className="mt-2 text-muted">Everything else? We&apos;ll handle it.</p>
            </div>
            <Controller control={control} name="consent" render={({ field }) => (
              <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm text-ink">
                <input type="checkbox" className="mt-0.5 h-5 w-5" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
                <span>
                  Yes, build my website and text or email me about it.
                  <span className="mt-1 block text-xs text-muted">We&apos;ll only use your info to build your site and reach you about it. No spam.</span>
                </span>
              </label>
            )} />
            {errors.consent && <p className="text-xs text-accent">{errors.consent.message}</p>}
            <div className="rounded-sm bg-[color:var(--accent-soft)] p-4 text-sm text-ink">
              <p className="font-medium">What happens next:</p>
              <p className="mt-1">1. We save everything and start on your site.</p>
              <p>2. You&apos;ll go to a secure checkout to complete your $500 build.</p>
              <p>3. We&apos;ll email your first preview as soon as it&apos;s ready.</p>
            </div>
            {submitError && <p role="alert" className="text-sm text-accent">{submitError}</p>}
          </>
        )}
      </div>

      {/* action bar */}
      <div className="sticky bottom-0 z-10 space-y-2 border-t border-line bg-surface px-1 py-3">
        <div className="flex items-center justify-between gap-3">
          {step > 1 ? <Button variant="ghost" onClick={goBack}>Back</Button> : <span />}
          {step < 4 ? (
            <Button variant="primary" onClick={goNext} withArrow>Continue</Button>
          ) : (
            <Button type="submit" variant="primary" withArrow>
              {submitting ? "Saving your info…" : "Save & continue to payment"}
            </Button>
          )}
        </div>
        {step === 2 && (
          <button type="button" onClick={goNext} className="block w-full text-center text-sm text-accent">Skip this — we&apos;ll fill it in for you</button>
        )}
        {step === 3 && (
          <button type="button" onClick={goNext} className="block w-full text-center text-sm text-accent">Skip photos for now</button>
        )}
        {step === 1 && (
          <p className="text-center text-xs text-muted">You won&apos;t be charged yet — payment is the last step.</p>
        )}
        <p className="text-center text-xs text-muted">Your answers save as you go.</p>
      </div>

      {submitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-white/95 px-6 text-center">
          <p className="text-lg font-medium text-ink">✓ Saved! Your info is with our build team.</p>
          <p className="text-sm text-muted">Your website spot is reserved — even if you close this page.</p>
          <p className="text-sm text-muted">Taking you to secure checkout…</p>
        </div>
      )}
    </form>
  );
}
