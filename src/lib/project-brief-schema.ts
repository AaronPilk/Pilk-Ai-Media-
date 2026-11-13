import { z } from "zod";
import { smsConsentShape } from "./sms-consent";

/**
 * Shared website-brief schema. Imported by the wizard (frontend) AND the
 * Cloudflare function (functions/api/leads.ts) so validation stays aligned.
 * Keep this file dependency-free except for zod.
 */

/**
 * Website field that accepts a bare domain ("example.com") OR a full URL and
 * normalizes to https://. Empty is allowed. Removes the "type the whole URL"
 * friction while still keeping a usable URL for the email/CRM.
 */
export const websiteField = z
  .string()
  .trim()
  .transform((v) => {
    if (!v) return "";
    const s = v.replace(/^\/+/, "");
    return /^https?:\/\//i.test(s) ? s : `https://${s}`;
  })
  .refine(
    (v) => v === "" || /^https?:\/\/([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i.test(v),
    { message: "Enter a website like example.com" }
  );

const inspirationSiteSchema = z.object({
  url: websiteField,
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export type InspirationSite = z.infer<typeof inspirationSiteSchema>;

export const projectBriefSchema = z.object({
  // Requests without a formType are briefs, so older builds keep working.
  formType: z.literal("project-brief").optional(),

  // Step 1 — business
  firstName: z.string().trim().min(1, "Required").max(80),
  lastName: z.string().trim().min(1, "Required").max(80),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  // Optional in practice since launch (it may be empty); now it may also be
  // missing, so a payload that leaves it out isn't rejected for that alone.
  currentWebsite: websiteField.default(""),
  businessDescription: z.string().trim().min(10, "Tell us a little more").max(2000),
  targetAudience: z.string().trim().max(1000).optional().or(z.literal("")),

  // Step 2 — project
  projectType: z.enum(["template", "premium-template", "custom", "redesign", "unsure"]),
  selectedTemplate: z.string().trim().max(120).optional().or(z.literal("")),
  primaryGoal: z.string().trim().max(500).optional().or(z.literal("")),
  requiredPages: z.array(z.string().max(100)).max(30).optional(),
  integrations: z.array(z.string().max(100)).max(30).optional(),
  needsIdx: z.boolean().optional(),

  // Step 4 — style
  selectedPalette: z.string().max(100).optional().or(z.literal("")),
  preferredColors: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).max(8).optional(),
  colorNotes: z.string().trim().max(400).optional().or(z.literal("")),
  styleDirection: z.string().max(120).optional().or(z.literal("")),
  styleKeywords: z.array(z.string().max(80)).max(12).optional(),
  // An unselected radio group reports null. Without this, a visitor who
  // skipped the (optional) question could not leave step 4, with no error shown.
  themePreference: z.preprocess(
    (v) => (v === null || v === "" ? undefined : v),
    z.enum(["light", "dark", "mixed", "unsure"]).optional()
  ),

  // Step 5 — inspiration
  inspirationSites: z.array(inspirationSiteSchema).max(5).optional(),

  // Step 6 — budget / review
  budget: z.string().max(120).optional().or(z.literal("")),
  timeline: z.string().max(120).optional().or(z.literal("")),
  preferredContact: z.enum(["email", "phone", "text"]).optional(),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please agree to be contacted.",
  }),
  ...smsConsentShape,

  // Attribution
  utmSource: z.string().max(300).optional().or(z.literal("")),
  utmMedium: z.string().max(300).optional().or(z.literal("")),
  utmCampaign: z.string().max(300).optional().or(z.literal("")),
  utmContent: z.string().max(300).optional().or(z.literal("")),
  utmTerm: z.string().max(300).optional().or(z.literal("")),
  landingPage: z.string().max(1000).optional().or(z.literal("")),
  referrer: z.string().max(1000).optional().or(z.literal("")),
  gclid: z.string().max(500).optional().or(z.literal("")),
  fbclid: z.string().max(500).optional().or(z.literal("")),

  // Spam trap
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export type ProjectBriefInput = z.infer<typeof projectBriefSchema>;

export const projectTypeChoices: {
  value: ProjectBriefInput["projectType"];
  label: string;
  hint: string;
}[] = [
  { value: "template", label: "Start with a template", hint: "Fastest path to launch" },
  { value: "premium-template", label: "Premium template", hint: "More customization" },
  { value: "custom", label: "Completely custom", hint: "Built from zero" },
  { value: "redesign", label: "Redesign existing site", hint: "Rebuild what you have" },
  { value: "unsure", label: "Not sure yet", hint: "We'll advise" },
];

export const requiredPagesOptions = [
  "Home",
  "About",
  "Services",
  "Listings / Portfolio",
  "Neighborhoods",
  "Pricing",
  "Testimonials",
  "Blog",
  "FAQ",
  "Contact",
];

export const integrationOptions = [
  "IDX / MLS",
  "Booking / scheduling",
  "CRM",
  "E-commerce",
  "Email marketing",
  "Live chat",
  "Payments",
  "Analytics",
];

export const styleDirections = [
  "Minimal and architectural",
  "Luxury and editorial",
  "Bold and modern",
  "Clean and corporate",
  "Warm and approachable",
  "Dark and cinematic",
  "Custom direction",
];

export const themeOptions: { value: NonNullable<ProjectBriefInput["themePreference"]>; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "mixed", label: "Mixed" },
  { value: "unsure", label: "Not sure" },
];

export const budgetOptions = [
  "Under $1,000",
  "$1,000–$2,500",
  "$2,500–$5,000",
  "$5,000–$10,000",
  "$10,000+",
];

export const timelineOptions = [
  "As soon as possible",
  "Within 2 weeks",
  "2–4 weeks",
  "1–2 months",
  "Flexible",
];

// File upload limits (shared client + server)
export const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
];
export const MAX_FILES = 10;
export const MAX_FILE_SIZE = 15 * 1024 * 1024;
export const MAX_TOTAL_SIZE = 60 * 1024 * 1024;
