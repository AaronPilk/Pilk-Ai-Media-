"use client";

import { useState } from "react";

/**
 * Floating "Request info" button + compact quick-inquiry popover for the
 * interactive listing experience. Submits to /api/leads so a real lead is
 * captured; shows an instant success state. (In a client build this routes to
 * the agent/firm's inbox or CRM.)
 */
export function QuickInquiry({ source = "Interactive listing experience" }: { source?: string }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setSending(true);
    const [firstName, ...rest] = name.trim().split(" ");
    const payload = {
      firstName,
      lastName: rest.join(" ") || "—",
      email: email.trim(),
      phone: phone.trim(),
      businessDescription:
        (message.trim() ? message.trim() + " — " : "") +
        `Quick inquiry from the ${source}. Please contact me.`,
      projectType: "unsure" as const,
      primaryGoal: "Be contacted about this property",
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

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden">
      {/* Popover */}
      {open && (
        <div className="mb-3 w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-white/15 bg-[#111016] text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span className="text-sm font-medium">Request information</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-white/50 transition-colors hover:text-white"
            >
              ✕
            </button>
          </div>

          {done ? (
            <div className="px-5 py-8 text-center">
              <div className="text-2xl">✓</div>
              <p className="mt-3 font-medium">Thanks — we&apos;ll be in touch shortly.</p>
              <p className="mt-2 text-sm text-white/60">
                Your request has been sent. Expect a call or email soon.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-3 px-5 py-5">
              <p className="text-sm text-white/60">
                Leave your details and we&apos;ll reach out about this property.
              </p>
              <input
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm placeholder:text-white/40 focus:border-accent focus:outline-none"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm placeholder:text-white/40 focus:border-accent focus:outline-none"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm placeholder:text-white/40 focus:border-accent focus:outline-none"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <textarea
                rows={2}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm placeholder:text-white/40 focus:border-accent focus:outline-none"
                placeholder="Message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {error && <p className="text-xs text-accent">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="mt-1 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {sending ? "Sending…" : "Request a call"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-medium text-white shadow-2xl ring-1 ring-white/15 transition-transform hover:-translate-y-0.5"
      >
        <span className="h-2 w-2 rounded-full bg-white/90" />
        {open ? "Close" : "Request info"}
      </button>
    </div>
  );
}
