import { z } from "zod";

/**
 * Shared template-intake schema. Imported by the on-site intake form (frontend)
 * AND the Cloudflare function (functions/api/template-intake.ts) so validation
 * stays aligned. Dependency-free except for zod.
 *
 * A client picks a template, fills this out, and uploads their assets. The
 * function emails everything (copy + file attachments) to the studio so the
 * template can be duplicated with their content.
 */

const optStr = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const templateIntakeSchema = z.object({
  // Which template they want built
  templateSlug: z.string().trim().min(1, "Required").max(120),
  templateName: optStr(160),

  // Who to contact
  yourName: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: optStr(60),

  // Brand
  businessName: z.string().trim().min(1, "Required").max(160),
  agentTitle: optStr(160), // e.g. "REALTOR®, Tampa Bay"
  tagline: optStr(200),
  brandColors: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).max(6).optional(),

  // Hero
  heroHeadline: optStr(200),
  heroSubtext: optStr(600),
  ctaText: optStr(60),

  // About
  aboutHeadline: optStr(200),
  aboutBody: optStr(2000),

  // Content blocks (one item per line — kept as text for low friction)
  servicesText: optStr(2000), // "Title | description" per line
  listingsText: optStr(3000), // "Address | Price | Beds/Baths/SqFt | description" per line
  testimonialsText: optStr(2000), // "\"Quote\" — Name" per line

  // Contact info to display on the site
  displayPhone: optStr(60),
  displayEmail: z.string().trim().email("Enter a valid email").max(200).optional().or(z.literal("")),
  address: optStr(300),
  serviceArea: optStr(300),

  // Links / socials
  website: z.string().trim().url("Enter a valid URL").max(300).optional().or(z.literal("")),
  instagram: optStr(300),
  facebook: optStr(300),
  linkedin: optStr(300),
  youtube: optStr(300),
  tiktok: optStr(300),

  // Extras
  notes: optStr(4000),
  fileNotes: optStr(2000), // explains which uploaded file is which

  consent: z.boolean().refine((v) => v === true, {
    message: "Please agree to be contacted.",
  }),

  // Attribution (optional)
  utmSource: optStr(300),
  utmMedium: optStr(300),
  utmCampaign: optStr(300),
  landingPage: optStr(1000),
  referrer: optStr(1000),

  // Spam trap
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export type TemplateIntakeInput = z.infer<typeof templateIntakeSchema>;

// File upload limits for intake (capped lower than the brief so all files fit
// as email attachments under Resend's ~40MB request limit).
export const INTAKE_ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "application/pdf",
];
export const INTAKE_MAX_FILES = 14;
export const INTAKE_MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB each
export const INTAKE_MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB total

/** Labeled upload groups shown in the form and reflected in the email. */
export const intakeUploadGroups: {
  field: string;
  label: string;
  hint: string;
  multiple: boolean;
}[] = [
  { field: "logo", label: "Logo", hint: "PNG/SVG with transparent background if possible", multiple: false },
  { field: "headshot", label: "Headshot / team photo", hint: "A clear photo of you or your team", multiple: true },
  { field: "hero", label: "Hero / banner image", hint: "Your best wide photo for the top of the site", multiple: false },
  { field: "gallery", label: "Property / gallery photos", hint: "Listings, interiors, work samples — add as many as you like", multiple: true },
  { field: "brand", label: "Brand assets / other", hint: "Brand guide, extra logos, anything else", multiple: true },
];
