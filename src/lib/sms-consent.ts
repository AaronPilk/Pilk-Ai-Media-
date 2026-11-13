import { z } from "zod";

/**
 * Optional SMS consent (TCPA / CTIA). Shared by the forms and the Pages
 * Functions so the wording a visitor saw and the wording we record can't drift.
 *
 * Never edit the text of a published version. Changing a single word means a
 * new version key: add it to SMS_CONSENT_TEXTS and point SMS_CONSENT_VERSION at
 * it. Old keys stay so consent records made under them still resolve.
 */
export const SMS_CONSENT_TEXTS = {
  "sms-v1-2026-11-13":
    "Text me at the number above. I agree that Pilk.ai (Pilk Consulting LLC) may send me text messages about my inquiry, project and account, and occasional marketing messages about its services, including messages sent using automated technology. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. See our Terms of Service and Privacy Policy.",
} as const;

export type SmsConsentVersion = keyof typeof SMS_CONSENT_TEXTS;

export const SMS_CONSENT_VERSION: SmsConsentVersion = "sms-v1-2026-11-13";
export const SMS_CONSENT_TEXT = SMS_CONSENT_TEXTS[SMS_CONSENT_VERSION];

/** The GoHighLevel tag added when a visitor ticks the box. */
export const SMS_CONSENT_TAG = "sms-consent";

/** Fields every form with a phone number sends alongside its own fields. */
export const smsConsentShape = {
  smsConsent: z.boolean().optional(),
  smsConsentVersion: z.string().trim().max(60).optional().or(z.literal("")),
  /** origin + path of the page the form was on (no query string) */
  pageUrl: z.string().trim().max(1000).optional().or(z.literal("")),
};

export function isKnownSmsConsentVersion(v: unknown): v is SmsConsentVersion {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(SMS_CONSENT_TEXTS, v);
}

/** True when a phone value has enough digits to be a real number. */
export function hasPhoneDigits(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15;
}

