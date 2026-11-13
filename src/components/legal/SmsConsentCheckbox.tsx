"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { SMS_CONSENT_TEXT } from "@/lib/sms-consent";

// The visible wording is built from SMS_CONSENT_TEXT, the same string the
// server records, so what the visitor reads and what we store can't differ.
const firstStop = SMS_CONSENT_TEXT.indexOf(". ") + 1;
const firstSentence = SMS_CONSENT_TEXT.slice(0, firstStop);
const rest = SMS_CONSENT_TEXT.slice(firstStop + 1);
const [beforeTerms, afterTerms = ""] = rest.split("Terms of Service");
const [betweenLinks, afterPrivacy = ""] = afterTerms.split("Privacy Policy");

/**
 * Optional, unticked SMS consent (TCPA / CTIA). Sits directly under a phone
 * field and shows once a number has been typed, because it refers to "the
 * number above". The parent clears the value when the phone is emptied.
 */
export function SmsConsentCheckbox({
  id,
  phone,
  checked,
  onChange,
  className,
}: {
  id: string;
  phone: string | undefined;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  if (!phone || !phone.trim()) return null;
  const linkCls = "underline underline-offset-2 hover:text-ink";
  return (
    <label
      htmlFor={id}
      data-testid="sms-consent"
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-sm border border-line bg-[color:var(--surface-2)] px-4 py-3 text-xs leading-relaxed text-muted",
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-4 w-4 flex-none"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span data-testid="sms-consent-text">
          <span className="font-medium text-ink">{firstSentence}</span> {beforeTerms}
          <Link href="/terms/" target="_blank" rel="noopener" className={linkCls}>
            Terms of Service
          </Link>
          {betweenLinks}
          <Link href="/privacy/" target="_blank" rel="noopener" className={linkCls}>
            Privacy Policy
          </Link>
          {afterPrivacy}
        </span>
        <span className="mt-1 block text-[11px] text-muted">Optional. You can still submit without it.</span>
      </span>
    </label>
  );
}
