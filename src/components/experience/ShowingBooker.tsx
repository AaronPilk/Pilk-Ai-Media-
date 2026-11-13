"use client";

import { useState } from "react";
import { FormLegalNotice } from "@/components/legal/FormLegalNotice";
import { useUTMParameters } from "@/hooks/useUTMParameters";
import { SHOWING_TIME_SLOTS as TIME_SLOTS } from "@/lib/quick-lead-schema";
import { currentPageUrl } from "@/lib/page-url";

const LISTING = "20 Bayshore Terrace";

const inputCls =
  "mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-accent";
const labelCls = "text-xs uppercase tracking-[0.15em] text-white/50";

/**
 * Book-a-private-showing form for the listing experience. Captures name, email,
 * phone, a preferred date (min today) and a single time-slot chip, plus a
 * message, then POSTs it to /api/leads (formType "listing-showing") and shows
 * a success state.
 */
export function ShowingBooker({ ctaLabel }: { ctaLabel: string }) {
  const attribution = useUTMParameters();
  const today = new Date().toISOString().slice(0, 10);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !date || !timeSlot) {
      setError("Please add your name, email, a preferred date, and a time slot.");
      return;
    }

    setSending(true);
    const payload = {
      formType: "listing-showing" as const,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      listing: LISTING,
      preferredDate: date,
      timeSlot,
      message: message.trim(),
      pageUrl: currentPageUrl(),
      honeypot,
      ...attribution,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({ success: res.ok }));
      if (!res.ok || json.success === false) {
        setError(json.error ?? "Something went wrong. Please try again.");
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
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center sm:p-12">
        <div className="text-3xl">✓</div>
        <h3 className="mt-4 font-display text-xl font-semibold">Your showing request is in.</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-white/60">
          We&apos;ll confirm your private showing of {LISTING}
          {date && timeSlot ? ` for ${date} at ${timeSlot}` : ""} by phone or email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-8">
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
          <label htmlFor="sb-name" className={labelCls}>
            Full name
          </label>
          <input
            id="sb-name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="sb-email" className={labelCls}>
            Email
          </label>
          <input
            id="sb-email"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="sb-phone" className={labelCls}>
            Phone
          </label>
          <input
            id="sb-phone"
            type="tel"
            placeholder="(555) 555-5555"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="sb-date" className={labelCls}>
            Preferred date
          </label>
          <input
            id="sb-date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputCls} [color-scheme:dark]`}
          />
        </div>
        <div className="sm:col-span-2">
          <span className={labelCls}>Preferred time</span>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {TIME_SLOTS.map((slot) => {
              const selected = timeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  aria-pressed={selected}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    selected
                      ? "border-accent bg-accent text-white"
                      : "border-white/10 bg-black/30 text-white/70 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="sb-message" className={labelCls}>
            Message
          </label>
          <textarea
            id="sb-message"
            rows={4}
            placeholder="Tell us a little about what you're looking for."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-accent">{error}</p>}

      <p className="mt-6 text-xs text-white/55">
        This is a demo listing. Showing requests from this form go to Pilk.ai.
      </p>
      <FormLegalNotice tone="dark" className="mt-2" />

      <button
        type="submit"
        disabled={sending}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {sending ? "Sending…" : ctaLabel}
      </button>
    </form>
  );
}
