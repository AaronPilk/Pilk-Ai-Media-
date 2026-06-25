"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectBriefSchema,
  type ProjectBriefInput,
} from "@/lib/project-brief-schema";
import { useUTMParameters } from "@/hooks/useUTMParameters";
import { trackEvent } from "@/lib/analytics";
import { WizardProgress } from "@/components/contact/WizardProgress";
import { WizardNavigation } from "@/components/contact/WizardNavigation";
import { BusinessStep } from "@/components/contact/steps/BusinessStep";
import { ProjectStep } from "@/components/contact/steps/ProjectStep";
import { TemplateStep } from "@/components/contact/steps/TemplateStep";
import { StyleStep } from "@/components/contact/steps/StyleStep";
import { InspirationStep } from "@/components/contact/steps/InspirationStep";
import { ReviewStep } from "@/components/contact/steps/ReviewStep";
import { ContactSuccess } from "@/components/contact/ContactSuccess";

const STORAGE_KEY = "pilk-project-brief-draft";

const stepTitles = [
  "Your business",
  "What we're building",
  "Starting design",
  "Colors & direction",
  "Inspiration & materials",
  "Budget & review",
];

const fieldsForStep: FieldPath<ProjectBriefInput>[][] = [
  ["firstName", "lastName", "email", "phone", "company", "industry", "currentWebsite", "businessDescription", "targetAudience"],
  ["projectType", "primaryGoal", "requiredPages", "integrations", "needsIdx"],
  ["selectedTemplate"],
  ["selectedPalette", "preferredColors", "styleDirection", "styleKeywords", "themePreference"],
  ["inspirationSites"],
  ["budget", "timeline", "preferredContact", "message", "consent"],
];

export function ProjectBriefWizard() {
  const params = useSearchParams();
  const attribution = useUTMParameters();
  const startedRef = useRef(false);

  const qpTemplate = params.get("template") ?? "";
  const qpTypeRaw = params.get("projectType");
  const validTypes = ["template", "premium-template", "custom", "redesign", "unsure"] as const;
  const qpType = (validTypes as readonly string[]).includes(qpTypeRaw ?? "")
    ? (qpTypeRaw as ProjectBriefInput["projectType"])
    : "unsure";

  const defaultValues: DefaultValues<ProjectBriefInput> = {
    firstName: "", lastName: "", email: "", phone: "", company: "", industry: "",
    currentWebsite: "", businessDescription: "", targetAudience: "",
    projectType: qpType, selectedTemplate: qpTemplate, primaryGoal: "",
    requiredPages: [], integrations: [], needsIdx: false,
    selectedPalette: "", preferredColors: [], styleDirection: "", styleKeywords: [],
    inspirationSites: [], budget: "", timeline: "", preferredContact: "email",
    message: "", consent: false,
    utmSource: "", utmMedium: "", utmCampaign: "", utmContent: "", utmTerm: "",
    landingPage: "", referrer: "", gclid: "", fbclid: "", honeypot: "",
  };

  const methods = useForm<ProjectBriefInput>({
    resolver: zodResolver(projectBriefSchema),
    mode: "onTouched",
    defaultValues,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  // Restore draft (excluding files) once on mount, keeping any query template.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Partial<ProjectBriefInput>;
        methods.reset({ ...defaultValues, ...draft });
        if (qpTemplate) methods.setValue("selectedTemplate", qpTemplate);
      }
    } catch {
      /* ignore corrupt draft */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist attribution
  useEffect(() => {
    methods.setValue("utmSource", attribution.utmSource);
    methods.setValue("utmMedium", attribution.utmMedium);
    methods.setValue("utmCampaign", attribution.utmCampaign);
    methods.setValue("utmContent", attribution.utmContent);
    methods.setValue("utmTerm", attribution.utmTerm);
    methods.setValue("landingPage", attribution.landingPage);
    methods.setValue("referrer", attribution.referrer);
    methods.setValue("gclid", attribution.gclid);
    methods.setValue("fbclid", attribution.fbclid);
  }, [attribution, methods]);

  // Debounced draft save (no accumulating timers; files excluded by design)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const sub = methods.watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        } catch {
          /* ignore quota */
        }
      }, 300);
    });
    return () => {
      clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [methods]);

  const onStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("contact_form_started");
  };

  const next = async () => {
    const valid = await methods.trigger(fieldsForStep[currentStep]);
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, stepTitles.length - 1));
  };

  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (values: ProjectBriefInput) => {
    setSubmitting(true);
    setServerError("");
    try {
      const body = new FormData();
      body.set("payload", JSON.stringify(values));
      files.forEach((file) => body.append("files", file));

      const res = await fetch("/api/leads", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setServerError(json.error ?? "Unable to submit your website brief.");
        trackEvent("contact_form_error");
        return;
      }
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      trackEvent("contact_form_submitted", { projectType: values.projectType });
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please try again.");
      trackEvent("contact_form_error");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <ContactSuccess firstName={methods.getValues("firstName")} />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} onFocus={onStart} noValidate>
        <WizardProgress steps={stepTitles} current={currentStep} />

        <h2 className="mb-8 mt-8 text-balance" style={{ fontSize: "var(--text-xl)" }}>
          {stepTitles[currentStep]}
        </h2>

        {currentStep === 0 && <BusinessStep />}
        {currentStep === 1 && <ProjectStep />}
        {currentStep === 2 && <TemplateStep />}
        {currentStep === 3 && <StyleStep />}
        {currentStep === 4 && <InspirationStep files={files} onFilesChange={setFiles} />}
        {currentStep === 5 && <ReviewStep files={files} />}

        {serverError && (
          <p
            role="alert"
            className="mt-6 rounded-sm border border-accent/40 bg-[color:var(--accent-soft)] px-4 py-3 text-sm"
          >
            {serverError}
          </p>
        )}

        {/* Honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          {...methods.register("honeypot")}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />

        <WizardNavigation
          current={currentStep}
          total={stepTitles.length}
          onBack={back}
          onNext={next}
          isSubmitting={submitting}
        />
      </form>
    </FormProvider>
  );
}
