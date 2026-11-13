import { z } from "zod";
import { smsConsentShape } from "./sms-consent";

/**
 * Shared template-request schema — used by the on-site wizard AND the Cloudflare
 * function (functions/api/template-intake.ts). It is a quote request, not an
 * order: nothing is charged. Dead-simple: only 4 required fields (name, email,
 * businessName, consent); everything else optional with server-side "we'll
 * write it / clean placeholder" fallbacks.
 */

/** The required box on the request form. Texting has its own optional box. */
export const INTAKE_CONSENT_LABEL = "Yes, send me a quote for this website and contact me about it";

const optStr = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const templateIntakeSchema = z.object({
  // --- the only 4 that can block ---
  name: z.string().trim().min(1, "What should we call you?").max(120),
  email: z
    .string()
    .trim()
    .min(1, "Add your email so we can send your site.")
    .email("Hmm, that email looks off — mind checking it?")
    .max(200),
  businessName: z.string().trim().min(1, "What's your business called?").max(160),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Just tick the box so we can send your quote." }),
  }),

  // optional, separate from the box above: agreement to text messages
  ...smsConsentShape,

  // which template they chose
  templateSlug: optStr(120),
  templateName: optStr(160),

  // optional profile
  phone: optStr(60),
  doWhat: z.enum(["mortgage", "realestate", "both", "other"]).optional(),
  doWhatOther: optStr(160),
  serviceArea: optStr(300),
  about: optStr(2000),
  services: z.array(z.string().trim().max(80)).max(20).optional(),
  nmls: optStr(60),
  title: optStr(160),

  // contact info to display on the site
  displayPhone: optStr(60),
  displayEmail: z.string().trim().email("Enter a valid email").max(200).optional().or(z.literal("")),
  useAccountPhone: z.boolean().optional(),
  useAccountEmail: z.boolean().optional(),

  links: z.array(z.string().trim().max(300)).max(6).optional(),
  notes: optStr(4000),
  sendPhotosLater: z.boolean().optional(),

  // attribution (optional)
  utmSource: optStr(300),
  utmMedium: optStr(300),
  utmCampaign: optStr(300),
  utmContent: optStr(300),
  utmTerm: optStr(300),
  landingPage: optStr(1000),
  referrer: optStr(1000),
  gclid: optStr(500),
  fbclid: optStr(500),

  // spam trap
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export type TemplateIntakeInput = z.infer<typeof templateIntakeSchema>;

export const INTAKE_ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "image/heic",
  "image/heif",
  "application/pdf",
];
export const INTAKE_MAX_FILES = 14;
export const INTAKE_MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB each
export const INTAKE_MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB total
