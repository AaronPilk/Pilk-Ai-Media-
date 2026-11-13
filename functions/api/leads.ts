/// <reference types="@cloudflare/workers-types" />
// Native Cloudflare Pages Function — handles POST /api/leads (JSON or multipart).
// Each form says which one it is with `formType`, and is validated with its own
// SHARED schema (the component uses the same one), so a short form is never
// held to the full brief's required fields. Stores uploads in private R2 when
// bound, escapes email HTML, and records optional SMS consent.
import {
  projectBriefSchema,
  ALLOWED_UPLOAD_TYPES,
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  type ProjectBriefInput,
} from "../../src/lib/project-brief-schema";
import { leadSchema, type LeadInput } from "../../src/lib/forms";
import {
  inquiryLeadSchema,
  listingInquirySchema,
  listingShowingSchema,
  type InquiryLeadInput,
  type ListingInquiryInput,
  type ListingShowingInput,
} from "../../src/lib/quick-lead-schema";
import { addGhlNote, sendToGhl } from "./_ghl";
import { SMS_CONSENT_TAG, consentEmailHtml, consentNoteText, smsConsentRecord } from "./_consent";

type Env = {
  PROJECT_UPLOADS?: R2Bucket;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  RESEND_API_KEY?: string;
  LEADS_FROM_EMAIL?: string;
  LEADS_NOTIFICATION_EMAIL?: string;
  CRM_WEBHOOK_URL?: string;
  GHL_PIT_TOKEN?: string;
  GHL_LOCATION_ID?: string;
};

const ALLOWED = new Set(ALLOWED_UPLOAD_TYPES);
// The largest JSON form (the contact form with a 5,000-character message) is
// well under this. Anything bigger is not a person filling in a form.
const MAX_JSON_BYTES = 64 * 1024;

type ParsedLead =
  | { formType: "project-brief"; data: ProjectBriefInput }
  | { formType: "contact"; data: LeadInput }
  | { formType: "inquiry"; data: InquiryLeadInput }
  | { formType: "listing-inquiry"; data: ListingInquiryInput }
  | { formType: "listing-showing"; data: ListingShowingInput };

type FormType = ParsedLead["formType"];

const FORM_LABEL: Record<FormType, string> = {
  "project-brief": "Project brief (/contact/)",
  contact: "Contact form (mortgage / real estate page)",
  inquiry: "Quick inquiry",
  "listing-inquiry": "Demo listing: Request info",
  "listing-showing": "Demo listing: Book a showing",
};

// How each form asks for agreement to the Terms, for the consent record.
const NOTICE = "submitted below “By submitting, you agree to the Terms of Service and acknowledge the Privacy Policy.”";
const TERMS_LINE: Record<FormType, string> = {
  "project-brief": `ticked “I agree to be contacted about my website project” and ${NOTICE}`,
  contact: NOTICE,
  inquiry: NOTICE,
  "listing-inquiry": NOTICE,
  "listing-showing": NOTICE,
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return "&#39;";
    }
  });
}

function sanitizeFileName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

/** Base64-encode an ArrayBuffer in chunks (avoids call-stack overflow on large files). */
function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function row(label: string, value: unknown): string {
  const v = String(value ?? "").trim();
  if (!v) return "";
  return `<p style="margin:4px 0"><strong>${esc(label)}:</strong> ${esc(v).replace(/\n/g, "<br/>")}</p>`;
}

function splitName(full: string): { firstName: string; lastName: string } {
  const [firstName = "", ...rest] = full.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

type SafeParse = { success: true; data: unknown } | { success: false; error: { flatten: () => unknown; issues: { message: string }[] } };

function parseLead(raw: unknown):
  | { ok: true; lead: ParsedLead }
  | { ok: false; formType: string | null; error: string; issues?: unknown } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, formType: null, error: "Invalid submission." };
  }
  const declared = (raw as { formType?: unknown }).formType;
  // No formType means the project brief: that's what every older build sent.
  const formType = declared === undefined ? "project-brief" : declared;
  const schemas: Record<FormType, { safeParse: (v: unknown) => SafeParse }> = {
    "project-brief": projectBriefSchema,
    contact: leadSchema,
    inquiry: inquiryLeadSchema,
    "listing-inquiry": listingInquirySchema,
    "listing-showing": listingShowingSchema,
  };
  if (typeof formType !== "string" || !(formType in schemas)) {
    return { ok: false, formType: typeof formType === "string" ? formType.slice(0, 40) : null, error: "Unknown form." };
  }
  const result = schemas[formType as FormType].safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0]?.message;
    return {
      ok: false,
      formType,
      error: first && first !== "Required" ? first : "Please review the highlighted fields.",
      issues: result.error.flatten(),
    };
  }
  return { ok: true, lead: { formType, data: result.data } as ParsedLead };
}

/** Everything the notifications and the CRM need, in one shape for every form. */
type Normalized = {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  tags: string[];
  subject: string;
  heading: string;
  detailsHtml: string;
  prospectSubject: string;
  prospectHtml: string;
  /** brief-shaped row for Supabase and the CRM webhook (their existing format) */
  legacyRow: Record<string, unknown>;
};

const brandFooter = `<p style="color:#888;font-size:12px">Pilk.ai is a brand of Pilk Consulting LLC.</p>`;

function attributionOf(d: {
  utmSource?: string; utmMedium?: string; utmCampaign?: string; utmContent?: string; utmTerm?: string;
  landingPage?: string; referrer?: string; gclid?: string; fbclid?: string;
}) {
  return {
    utmSource: d.utmSource ?? "", utmMedium: d.utmMedium ?? "", utmCampaign: d.utmCampaign ?? "",
    utmContent: d.utmContent ?? "", utmTerm: d.utmTerm ?? "", landingPage: d.landingPage ?? "",
    referrer: d.referrer ?? "", gclid: d.gclid ?? "", fbclid: d.fbclid ?? "",
  };
}

function normalize(lead: ParsedLead): Normalized {
  switch (lead.formType) {
    case "project-brief": {
      const d = lead.data;
      const name = `${d.firstName} ${d.lastName}`.trim();
      // The brief's row keeps exactly the fields it always had.
      const { formType: _f, smsConsent: _s, smsConsentVersion: _v, pageUrl: _p, ...legacyRow } = d;
      return {
        firstName: d.firstName, lastName: d.lastName, name, email: d.email, phone: d.phone ?? "",
        company: d.company ?? "",
        tags: ["pilk-website-lead", d.projectType],
        subject: `New website brief — ${name}`,
        heading: "New website brief",
        detailsHtml: `
          <p>Company: ${esc(d.company) || "—"} · Industry: ${esc(d.industry) || "—"}</p>
          <p>Project: ${esc(d.projectType)}${d.selectedTemplate ? " (" + esc(d.selectedTemplate) + ")" : ""}</p>
          <p>Goal: ${esc(d.primaryGoal) || "—"}</p>
          <p>Pages: ${esc((d.requiredPages ?? []).join(", ")) || "—"}</p>
          <p>Integrations: ${esc((d.integrations ?? []).join(", ")) || "—"}</p>
          <p>Palette: ${esc(d.selectedPalette) || "—"} · Colors: ${esc((d.preferredColors ?? []).join(" "))}${d.colorNotes ? " · Wants: " + esc(d.colorNotes) : ""}</p>
          <p>Style: ${esc(d.styleDirection) || "—"} · Theme: ${esc(d.themePreference) || "—"}</p>
          <p>Inspiration: ${(d.inspirationSites ?? []).map((s) => esc(s.url)).join(", ") || "—"}</p>
          <p>Budget: ${esc(d.budget) || "—"} · Launch: ${esc(d.timeline) || "—"}</p>
          <p>Notes: ${esc(d.message) || "—"}</p>`,
        prospectSubject: "We received your website brief — Pilk.ai",
        prospectHtml: `
          <h2>Thanks for your website brief</h2>
          <p>Hi ${esc(d.firstName)}, we received your project details and we'll be in touch shortly.</p>
          <p>— Pilk.ai</p>
          ${brandFooter}`,
        legacyRow,
      };
    }
    case "contact": {
      const d = lead.data;
      const name = `${d.firstName} ${d.lastName}`.trim();
      return {
        firstName: d.firstName, lastName: d.lastName, name, email: d.email, phone: d.phone ?? "",
        company: d.company ?? "",
        tags: ["pilk-website-lead", d.projectType],
        subject: `New website inquiry — ${name}`,
        heading: "New website inquiry (contact form)",
        detailsHtml: [
          row("Company / brokerage", d.company),
          row("Industry", d.industry),
          row("Project", d.projectType + (d.selectedTemplate ? ` (${d.selectedTemplate})` : "")),
          row("Budget", d.budget),
          row("Desired launch", d.timeline),
          row("Preferred contact", d.preferredContact),
          row("Current website", d.currentWebsite),
          d.needsIdx ? row("IDX / MLS", "Needs IDX / MLS integration") : "",
          row("Project details", d.message),
        ].join(""),
        prospectSubject: "We received your inquiry — Pilk.ai",
        prospectHtml: `
          <h2>Thanks for reaching out</h2>
          <p>Hi ${esc(d.firstName)}, we received your project details and we'll be in touch shortly.</p>
          <p>— Pilk.ai</p>
          ${brandFooter}`,
        legacyRow: {
          firstName: d.firstName, lastName: d.lastName, email: d.email, phone: d.phone ?? "",
          company: d.company ?? "", industry: d.industry ?? "", currentWebsite: d.currentWebsite,
          businessDescription: d.message, projectType: d.projectType, selectedTemplate: d.selectedTemplate ?? "",
          budget: d.budget ?? "", timeline: d.timeline ?? "", needsIdx: d.needsIdx ?? false,
          preferredContact: d.preferredContact, message: d.message, consent: true, ...attributionOf(d),
        },
      };
    }
    case "inquiry":
    case "listing-inquiry":
    case "listing-showing": {
      const d = lead.data;
      const { firstName, lastName } = splitName(d.name);
      const name = d.name.trim();
      const email = d.email ?? "";
      let heading: string, subject: string, tag: string, details: string, goal: string;
      let prospectSubject = "We received your inquiry — Pilk.ai";
      let prospectBody = `<p>Hi ${esc(firstName)}, thanks for reaching out. We got your message and we'll be in touch shortly.</p>`;
      if (lead.formType === "inquiry") {
        const q = lead.data;
        heading = "New quick inquiry";
        subject = `New quick inquiry — ${name}`;
        tag = "quick-inquiry";
        goal = q.intent || "Be contacted";
        details = [row("Message", q.message), row("About", q.intent)].join("");
      } else if (lead.formType === "listing-inquiry") {
        const q = lead.data;
        heading = "New demo listing inquiry (Request info)";
        subject = `New demo listing inquiry — ${name}`;
        tag = "listing-demo-inquiry";
        goal = "Be contacted about the demo listing";
        details = [row("Listing experience", q.source), row("Message", q.message)].join("");
        prospectSubject = "We received your request — Pilk.ai";
        prospectBody = `<p>Hi ${esc(firstName)}, we got your request. The listing you were viewing is a demo built by Pilk.ai, so your request came to us, and we'll be in touch shortly.</p>`;
      } else {
        const q = lead.data;
        heading = "New showing request (demo listing)";
        subject = `New showing request (demo listing) — ${name}`;
        tag = "listing-demo-showing";
        goal = "Book a showing";
        details = [
          row("Listing", q.listing),
          row("Preferred date and time", `${q.preferredDate} at ${q.timeSlot}`),
          row("Message", q.message),
        ].join("");
        prospectSubject = "We received your showing request — Pilk.ai";
        prospectBody = `<p>Hi ${esc(firstName)}, we got your showing request for ${esc(q.preferredDate)} at ${esc(q.timeSlot)}. The listing is a demo built by Pilk.ai, so your request came to us, and we'll be in touch shortly.</p>`;
      }
      const message = "message" in d ? d.message ?? "" : "";
      return {
        firstName, lastName, name, email, phone: d.phone ?? "", company: "",
        tags: ["pilk-website-lead", tag],
        subject, heading,
        detailsHtml: details,
        prospectSubject,
        prospectHtml: `<h2>Thanks for reaching out</h2>${prospectBody}<p>— Pilk.ai</p>${brandFooter}`,
        legacyRow: {
          firstName, lastName: lastName || "—", email, phone: d.phone ?? "", company: "", industry: "",
          currentWebsite: "", businessDescription: [goal, message].filter(Boolean).join(" — "),
          projectType: "unsure", selectedTemplate: "", primaryGoal: goal,
          preferredContact: d.phone ? "phone" : "email", message, consent: true, ...attributionOf(d),
        },
      };
    }
  }
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let rawPayload: unknown;
    let files: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const payloadValue = formData.get("payload");
      if (typeof payloadValue !== "string") {
        return json({ success: false, error: "Missing website brief." }, 400);
      }
      try {
        rawPayload = JSON.parse(payloadValue);
      } catch {
        return json({ success: false, error: "Invalid website brief." }, 400);
      }
      files = formData
        .getAll("files")
        .filter((v): v is File => v instanceof File);
    } else {
      if (Number(request.headers.get("content-length") || 0) > MAX_JSON_BYTES) {
        return json({ success: false, error: "That's more than this form accepts." }, 413);
      }
      const text = await request.text();
      if (text.length > MAX_JSON_BYTES) {
        return json({ success: false, error: "That's more than this form accepts." }, 413);
      }
      try {
        rawPayload = JSON.parse(text);
      } catch {
        return json({ success: false, error: "Invalid submission." }, 400);
      }
    }

    // Spam trap first: a filled hidden field gets a quiet success, so a bot
    // learns nothing from a validation error. Nothing is stored or sent.
    const trap = (rawPayload as { honeypot?: unknown } | null)?.honeypot;
    if (typeof trap === "string" && trap.length > 0) return json({ success: true });

    const parsed = parseLead(rawPayload);
    if (!parsed.ok) {
      return json({ success: false, formType: parsed.formType, error: parsed.error, issues: parsed.issues }, 400);
    }
    const { lead } = parsed;
    const formType = lead.formType;

    // Only the project brief takes files.
    if (formType !== "project-brief" && files.length > 0) {
      return json({ success: false, formType, error: "This form doesn't take files." }, 400);
    }

    // Validate files
    if (files.length > MAX_FILES) {
      return json({ success: false, error: `Upload no more than ${MAX_FILES} files.` }, 400);
    }
    let totalSize = 0;
    for (const file of files) {
      totalSize += file.size;
      if (!ALLOWED.has(file.type)) {
        return json({ success: false, error: `${file.name} is not an accepted file type.` }, 400);
      }
      if (file.size > MAX_FILE_SIZE) {
        return json({ success: false, error: `${file.name} is larger than 15 MB.` }, 400);
      }
    }
    if (totalSize > MAX_TOTAL_SIZE) {
      return json({ success: false, error: "The combined upload is larger than 60 MB." }, 400);
    }

    const n = normalize(lead);
    const receivedAt = new Date().toISOString();
    const sms = smsConsentRecord(request, lead.data, receivedAt);

    // Read each file once; store in R2 when the bucket is bound, AND attach to
    // the internal email when small enough. This guarantees uploads actually
    // reach the inbox even if R2 isn't configured.
    const uploadedFiles: Array<{ key?: string; name: string; type: string; size: number }> = [];
    const emailAttachments: Array<{ filename: string; content: string }> = [];
    const ATTACH_LIMIT = 20 * 1024 * 1024; // stay within Resend + worker memory
    const canAttach = files.length > 0 && totalSize <= ATTACH_LIMIT;

    if (files.length > 0 && !env.PROJECT_UPLOADS && !canAttach) {
      return json(
        { success: false, error: "These files are large — please email them directly, or remove them to submit." },
        400
      );
    }

    if (files.length > 0) {
      const submissionId = crypto.randomUUID();
      for (const file of files) {
        const buf = await file.arrayBuffer();
        const safeName = sanitizeFileName(file.name) || "file";
        let key: string | undefined;
        if (env.PROJECT_UPLOADS) {
          key = `project-briefs/${submissionId}/${crypto.randomUUID()}-${safeName}`;
          await env.PROJECT_UPLOADS.put(key, buf, {
            httpMetadata: { contentType: file.type },
            customMetadata: {
              originalName: file.name.slice(0, 200),
              submittedBy: n.email,
            },
          });
        }
        if (canAttach) emailAttachments.push({ filename: safeName, content: toBase64(buf) });
        uploadedFiles.push({ key, name: file.name, type: file.type, size: file.size });
      }
    }

    // Store lead (best effort — don't fail the submission if storage errors).
    // The row keeps the brief's field names, which is the table's format.
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await fetch(`${env.SUPABASE_URL}/rest/v1/leads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ ...n.legacyRow, uploaded_files: uploadedFiles, created_at: receivedAt }),
        });
      } catch (e) {
        console.error("[leads] supabase error", e);
      }
    } else {
      console.log(
        "[leads] new lead:", formType, n.name, n.email || n.phone,
        `${uploadedFiles.length} files`, `sms:${sms.given ? "yes" : "no"}`
      );
    }

    // Emails (escaped). Internal includes R2 keys; prospect never does.
    if (env.RESEND_API_KEY && env.LEADS_FROM_EMAIL) {
      const send = (
        to: string,
        subject: string,
        html: string,
        attachments?: Array<{ filename: string; content: string }>
      ) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: env.LEADS_FROM_EMAIL,
            to,
            subject,
            html,
            ...(attachments && attachments.length ? { attachments } : {}),
          }),
        });

      const fileLines = uploadedFiles
        .map(
          (f) =>
            `<li>${esc(f.name)} (${Math.round(f.size / 1024)} KB)${
              f.key ? ` — <code>${esc(f.key)}</code>` : " — attached to this email"
            }</li>`
        )
        .join("");

      const d = lead.data;
      const internalHtml = `
        <h2>${esc(n.heading)}</h2>
        <p><strong>${esc(n.name)}</strong> — ${esc(n.email) || "no email"}${n.phone ? " · " + esc(n.phone) : ""}</p>
        ${n.detailsHtml}
        ${uploadedFiles.length ? `<p>Files:</p><ul>${fileLines}</ul>` : ""}
        ${consentEmailHtml(sms, TERMS_LINE[formType])}
        <hr/>
        <p style="color:#888;font-size:12px">Form: ${esc(FORM_LABEL[formType])} · Source: ${esc(d.utmSource) || "direct"} / ${esc(d.utmCampaign) || "—"} · Landing: ${esc(d.landingPage) || "—"} · Received: ${esc(receivedAt)}</p>
      `;

      const tasks: Promise<unknown>[] = [];
      if (env.LEADS_NOTIFICATION_EMAIL) {
        tasks.push(send(env.LEADS_NOTIFICATION_EMAIL, n.subject, internalHtml, emailAttachments));
      }
      if (n.email) tasks.push(send(n.email, n.prospectSubject, n.prospectHtml));
      await Promise.allSettled(tasks);
    }

    // GoHighLevel (best effort — form leads flow into the CRM). The consent
    // record goes on the contact as a note, so it survives tag changes.
    const contactId = await sendToGhl(env, {
      firstName: n.firstName,
      lastName: n.lastName || undefined,
      email: n.email || undefined,
      phone: n.phone || undefined,
      companyName: n.company || undefined,
      source: "pilk.ai website",
      tags: [...n.tags, sms.given ? SMS_CONSENT_TAG : ""],
    });
    if (sms.given) await addGhlNote(env, contactId, consentNoteText(sms, FORM_LABEL[formType]));

    // CRM webhook (no file binaries; keys only)
    if (env.CRM_WEBHOOK_URL) {
      try {
        await fetch(env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...n.legacyRow, formType, smsConsent: sms, uploaded_files: uploadedFiles }),
        });
      } catch (e) {
        console.error("[leads] crm error", e);
      }
    }

    return json({ success: true });
  } catch (e) {
    console.error("[leads] failed", e);
    return json({ success: false, error: "We could not submit your request. Please try again." }, 500);
  }
};
