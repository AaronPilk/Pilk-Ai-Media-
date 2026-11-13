/// <reference types="@cloudflare/workers-types" />
// Builds the record of a visitor's optional SMS consent from a form
// submission, and renders it for the notification email and the GoHighLevel
// note. Files prefixed _ aren't routed.
import {
  SMS_CONSENT_TAG,
  SMS_CONSENT_TEXTS,
  hasPhoneDigits,
  isKnownSmsConsentVersion,
} from "../../src/lib/sms-consent";

export { SMS_CONSENT_TAG };

export type SmsConsentRecord =
  | {
      given: true;
      /** server time the submission arrived, ISO 8601 UTC */
      at: string;
      pageUrl: string;
      version: string;
      text: string;
      phone: string;
      ip: string;
      userAgent: string;
    }
  | { given: false; reason: "not-ticked" | "no-phone" | "unknown-version" };

type ConsentFields = {
  smsConsent?: boolean;
  smsConsentVersion?: string;
  pageUrl?: string;
  phone?: string;
};

/** origin + path only. Falls back to the Referer header, then to "". */
function cleanPageUrl(value: string | undefined, referer: string | null): string {
  for (const candidate of [value, referer]) {
    if (!candidate) continue;
    try {
      const u = new URL(candidate);
      if (u.protocol === "https:" || u.protocol === "http:") return `${u.origin}${u.pathname}`.slice(0, 500);
    } catch {
      /* not a URL; try the next one */
    }
  }
  return "";
}

/**
 * Consent counts only when the box was ticked, there is a usable phone number,
 * and the wording version is one we published (so we can say exactly what the
 * visitor agreed to).
 */
export function smsConsentRecord(request: Request, fields: ConsentFields, receivedAt: string): SmsConsentRecord {
  if (fields.smsConsent !== true) return { given: false, reason: "not-ticked" };
  if (!hasPhoneDigits(fields.phone)) return { given: false, reason: "no-phone" };
  if (!isKnownSmsConsentVersion(fields.smsConsentVersion)) {
    console.error("[consent] unknown SMS consent version", String(fields.smsConsentVersion).slice(0, 60));
    return { given: false, reason: "unknown-version" };
  }
  return {
    given: true,
    at: receivedAt,
    pageUrl: cleanPageUrl(fields.pageUrl, request.headers.get("referer")),
    version: fields.smsConsentVersion,
    text: SMS_CONSENT_TEXTS[fields.smsConsentVersion],
    phone: String(fields.phone ?? "").trim(),
    ip: request.headers.get("cf-connecting-ip") ?? "",
    userAgent: (request.headers.get("user-agent") ?? "").slice(0, 300),
  };
}

function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );
}

/**
 * The consent block for the internal notification email. `termsLine` says how
 * the visitor agreed to the Terms on that form.
 */
export function consentEmailHtml(sms: SmsConsentRecord, termsLine: string): string {
  const smsHtml = sms.given
    ? `<p style="margin:4px 0"><strong>Text messages: YES.</strong> Ticked the optional SMS box.</p>
       <ul style="margin:4px 0 4px 18px;padding:0">
         <li>Given: ${esc(sms.at)}</li>
         <li>Page: ${esc(sms.pageUrl) || "—"}</li>
         <li>Phone: ${esc(sms.phone)}</li>
         <li>Wording version: <code>${esc(sms.version)}</code></li>
         <li>IP address: ${esc(sms.ip) || "—"} · Browser: ${esc(sms.userAgent) || "—"}</li>
       </ul>
       <p style="margin:4px 0;color:#555;font-size:12px">Wording shown: “${esc(sms.text)}”</p>`
    : sms.reason === "no-phone"
      ? `<p style="margin:4px 0"><strong>Text messages: no.</strong> No phone number given.</p>`
      : `<p style="margin:4px 0"><strong>Text messages: NOT agreed.</strong> The optional SMS box was not ticked. Don't text this number unless they ask you to.</p>`;
  return `
    <h3 style="margin:16px 0 4px">Consent</h3>
    <p style="margin:4px 0">Terms &amp; Privacy: ${esc(termsLine)}</p>
    ${smsHtml}
  `;
}

/** Plain-text note for the GoHighLevel contact, written only when consent was given. */
export function consentNoteText(sms: Extract<SmsConsentRecord, { given: true }>, formLabel: string): string {
  return [
    "SMS consent: YES (optional box ticked on pilk.ai)",
    `Given: ${sms.at}`,
    `Form: ${formLabel}`,
    `Page: ${sms.pageUrl || "unknown"}`,
    `Phone: ${sms.phone}`,
    `Consent wording version: ${sms.version}`,
    `Wording shown: "${sms.text}"`,
    `IP address: ${sms.ip || "unknown"}`,
    `Browser: ${sms.userAgent || "unknown"}`,
  ].join("\n");
}
