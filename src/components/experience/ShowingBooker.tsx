"use client";

import { useState } from "react";

const TIME_SLOTS = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

const inputCls =
  "mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-accent";
const labelCls = "text-xs uppercase tracking-[0.15em] text-white/50";

/**
 * Book-a-private-showing form for the listing experience. Captures name, email,
 * phone, a preferred date (min today) and a single time-slot chip, plus a
 * message, then POSTs a normalized lead to /api/leads and shows a success state.
 */
export function ShowingBooker({ ctaLabel }: { ctaLabel: string }) {
  const today = new Date().toISOString().slice(0, 10);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");

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
    const [firstName, ...rest] = name.trim().split(" ");
    const description = (
      `Private showing request for 20 Bayshore Terrace — preferred ${date} at ${timeSlot}. ` +
      message.trim()
    ).slice(0, 1000);

    const payload = {
      firstName,
      lastName: rest.join(" ") || "—",
      email: email.trim(),
      phone: phone.trim(),
      // Guaranteed > 10 chars by the fixed prefix above.
      businessDescription:
        description.length >= 10 ? description : `${description} Please contact me.`,
      projectType: "unsure" as const,
      primaryGoal: "Book a showing",
      preferredContact: phone.trim() ? ("phone" as const) : ("email" as const),
      consent: true,
      landingPage: typeof window !== "undefined" ? window.location.pathname : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
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
          We&apos;ll confirm your private showing of 20 Bayshore Terrace
          {date && timeSlot ? ` for ${date} at ${timeSlot}` : ""} by phone or email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-8">
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
