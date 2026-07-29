"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { ADDONS, priceCents, CHECKOUT, type AddonKey } from "@/lib/checkout-pricing";
import { Button } from "@/components/ui/Button";

const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function CheckoutClient() {
  const params = useSearchParams();
  const template = params.get("template") || "";
  const [selected, setSelected] = useState<AddonKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => priceCents(selected), [selected]);

  const toggle = (k: AddonKey) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  async function pay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ addons: selected, template }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
      window.location.href = data.url;
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <span className="eyebrow text-accent">Secure checkout</span>
      <h1 className="mt-4 text-balance" style={{ fontSize: "var(--text-2xl)" }}>
        Complete your mortgage website order
      </h1>
      {template ? (
        <p className="mt-3 text-muted">
          Design selected: <span className="font-medium text-ink">{template}</span>
        </p>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="rounded-2xl border border-line p-6">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold">Mortgage website build</h2>
                <p className="mt-1 text-sm text-muted">
                  Your chosen design, built out as yours and launched on your domain.
                </p>
              </div>
              <span className="font-display text-xl font-semibold">${CHECKOUT.base}</span>
            </div>
          </div>

          <h3 className="mt-8 font-display text-lg font-semibold">Add integrations (optional)</h3>
          <p className="mt-1 text-sm text-muted">${CHECKOUT.addonPrice} each — toggle what you want.</p>

          <div className="mt-4 space-y-3">
            {ADDONS.map((a) => {
              const on = selected.includes(a.key);
              return (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => toggle(a.key)}
                  aria-pressed={on}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition ${
                    on
                      ? "border-accent bg-[color:var(--accent-soft)]"
                      : "border-line hover:border-accent/50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md border ${
                      on ? "border-accent bg-accent text-white" : "border-line"
                    }`}
                  >
                    {on ? <Check size={13} aria-hidden /> : null}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium">{a.label}</span>
                      <span className="text-sm font-semibold">+${CHECKOUT.addonPrice}</span>
                    </span>
                    <span className="mt-1 block text-sm text-muted">{a.blurb}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-accent/40 bg-[color:var(--accent-soft)] p-5">
            <p className="text-sm">
              <span className="font-semibold">About GoHighLevel:</span> the ${CHECKOUT.addonPrice} connection only{" "}
              <em>connects</em> your forms to GHL. Actually building out your CRM — pipelines, workflows,
              automations, and follow-up — is a separate build-out (typically $1,000+, scoped to your operation).
              We&apos;ll walk you through it once your site is live.
            </p>
          </div>
        </div>

        <aside className="h-max rounded-2xl border border-line p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Website build</dt>
              <dd>${CHECKOUT.base}.00</dd>
            </div>
            {selected.map((k) => (
              <div key={k} className="flex justify-between">
                <dt className="text-muted">{ADDONS.find((a) => a.key === k)?.label}</dt>
                <dd>+${CHECKOUT.addonPrice}.00</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-3">
              <dt className="text-muted">Subtotal</dt>
              <dd>{money(totals.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Fees &amp; processing (10%)</dt>
              <dd>{money(totals.feeCents)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
              <dt>Total due today</dt>
              <dd>{money(totals.totalCents)}</dd>
            </div>
          </dl>

          <p className="mt-5 rounded-xl border border-line p-4 text-xs text-muted">
            Then <span className="font-semibold text-ink">${CHECKOUT.monthly}/mo</span> for hosting, support &amp;
            edits — your first monthly charge is {CHECKOUT.monthlyTrialDays} days after today. Cancel anytime.
          </p>

          <div className="mt-6">
            <Button variant="primary" onClick={pay} withArrow className="w-full justify-center">
              {loading ? "Starting secure checkout…" : `Pay ${money(totals.totalCents)} with Stripe`}
            </Button>
          </div>
          {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
          <p className="mt-3 text-center text-xs text-muted">
            Payments secured by Stripe. Card details never touch our servers.
          </p>
        </aside>
      </div>
    </div>
  );
}
