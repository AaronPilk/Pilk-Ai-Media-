"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormLegalNotice } from "@/components/legal/FormLegalNotice";
import { SmsConsentCheckbox } from "@/components/legal/SmsConsentCheckbox";
import { useUTMParameters } from "@/hooks/useUTMParameters";
import { SMS_CONSENT_VERSION } from "@/lib/sms-consent";
import { currentPageUrl } from "@/lib/page-url";
import { readSubmitResult } from "@/lib/form-response";

const inputCls =
  "w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm placeholder:text-muted focus:border-accent";

/**
 * Short, low-friction lead form — just enough to capture a contact. Posts to
 * /api/leads as formType "inquiry". (The full project brief lives at /contact
 * via "Start a Project".)
 */
export function InquiryForm({
  intent,
  submitLabel,
}: {
  intent?: string;
  submitLabel?: string;
} = {}) {
  const attribution = useUTMParameters();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const onPhone = (value: string) => {
    setPhone(value);
    if (!value.trim()) setSmsConsent(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please add your name and email.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "inquiry",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          intent: intent ?? "",
          smsConsent: smsConsent && phone.trim() !== "",
          smsConsentVersion: SMS_CONSENT_VERSION,
          pageUrl: currentPageUrl(),
          honeypot,
          ...attribution,
        }),
      });
      const result = await readSubmitResult(res, "Something went wrong. Please try again.");
      if (!result.ok) {
        setError(result.error);
        setSending(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    }
    setSending(false);
  };

  if (done) {
    return (
      <div className="rounded-md border border-accent/40 bg-[color:var(--accent-soft)] p-8">
        <h2 className="text-2xl font-medium">Thanks — we&apos;ll be in touch 🎉</h2>
        <p className="mt-3 max-w-lg text-muted">
          Your inquiry is in. We&apos;ll reach out shortly. When you&apos;re ready to give us the full
          picture, you can start a detailed project brief anytime.
        </p>
        <div className="mt-6">
          <Button href="/contact" variant="primary" withArrow>
            Start a Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid max-w-xl gap-5">
      {/* Honeypot */}
      <input
        type="text"
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="iq-name" className="mb-2 block text-sm text-muted">Name</label>
          <input id="iq-name" autoComplete="name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="iq-email" className="mb-2 block text-sm text-muted">Email</label>
          <input id="iq-email" type="email" autoComplete="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div>
        <label htmlFor="iq-phone" className="mb-2 block text-sm text-muted">Phone (optional)</label>
        <input id="iq-phone" type="tel" autoComplete="tel" className={inputCls} value={phone} onChange={(e) => onPhone(e.target.value)} />
      </div>
      <SmsConsentCheckbox id="iq-smsConsent" phone={phone} checked={smsConsent} onChange={setSmsConsent} />
      <div>
        <label htmlFor="iq-msg" className="mb-2 block text-sm text-muted">What can we help with? (optional)</label>
        <textarea id="iq-msg" rows={3} className={inputCls} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      {error && (
        <p role="alert" className="rounded-sm border border-accent/40 bg-[color:var(--accent-soft)] px-4 py-3 text-sm">
          {error}
        </p>
      )}
      <FormLegalNotice />
      <div>
        <Button type="submit" variant="primary" withArrow>
          {sending ? "Sending…" : submitLabel ?? "Submit inquiry"}
        </Button>
      </div>
    </form>
  );
}
