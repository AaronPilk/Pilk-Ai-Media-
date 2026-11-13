import { z } from "zod";
import { hasPhoneDigits, smsConsentShape } from "./sms-consent";

/**
 * Schemas for the short lead forms: the quick inquiry (/inquiry/, the home
 * page's "Inquiry Now", /fourth-of-july/) and the two forms on the demo
 * listing page. Shared by the components and functions/api/leads.ts.
 *
 * They ask only for what the forms collect. The rule that stops junk is the
 * same everywhere: a name, plus an email or a phone number we can use.
 */

const optStr = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

const attributionShape = {
  utmSource: optStr(300),
  utmMedium: optStr(300),
  utmCampaign: optStr(300),
  utmContent: optStr(300),
  utmTerm: optStr(300),
  landingPage: optStr(1000),
  referrer: optStr(1000),
  gclid: optStr(500),
  fbclid: optStr(500),
};

const contactShape = {
  name: z.string().trim().min(1, "Please add your name.").max(120),
  email: z.string().trim().email("That email looks off. Mind checking it?").max(200).optional().or(z.literal("")),
  phone: optStr(40),
  ...smsConsentShape,
  ...attributionShape,
  // Spam trap: the field is hidden, so a person never fills it.
  honeypot: z.string().max(0).optional().or(z.literal("")),
  // Older builds sent consent: true without a checkbox. Accepted and ignored;
  // agreement to the Terms is the notice above the submit button.
  consent: z.boolean().optional(),
};

const needsEmailOrPhone = <T extends { email?: string; phone?: string }>(v: T) =>
  Boolean(v.email && v.email.length > 0) || hasPhoneDigits(v.phone);

const emailOrPhoneIssue = {
  message: "Please add an email or a phone number so we can reach you.",
  path: ["email"],
};

export const inquiryLeadSchema = z
  .object({
    formType: z.literal("inquiry"),
    ...contactShape,
    message: optStr(2000),
    /** what the page was about, e.g. a promotion on /fourth-of-july/ */
    intent: optStr(200),
  })
  .refine(needsEmailOrPhone, emailOrPhoneIssue);

export const listingInquirySchema = z
  .object({
    formType: z.literal("listing-inquiry"),
    ...contactShape,
    message: optStr(2000),
    /** which demo listing experience the visitor was on */
    source: optStr(200),
  })
  .refine(needsEmailOrPhone, emailOrPhoneIssue);

export const SHOWING_TIME_SLOTS = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"] as const;

export const listingShowingSchema = z
  .object({
    formType: z.literal("listing-showing"),
    ...contactShape,
    message: optStr(2000),
    listing: optStr(200),
    preferredDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a preferred date."),
    timeSlot: z.enum(SHOWING_TIME_SLOTS, { errorMap: () => ({ message: "Pick a time slot." }) }),
  })
  .refine(needsEmailOrPhone, emailOrPhoneIssue);

export type InquiryLeadInput = z.infer<typeof inquiryLeadSchema>;
export type ListingInquiryInput = z.infer<typeof listingInquirySchema>;
export type ListingShowingInput = z.infer<typeof listingShowingSchema>;
