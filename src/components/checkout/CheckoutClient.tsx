"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import {
  ADDONS,
  priceCents,
  CHECKOUT,
  RENEWAL_CONSENT_TEXT,
  RENEWAL_CONSENT_VERSION,
  firstMonthlyChargeDate,
  type AddonKey,
} from "@/lib/checkout-pricing";
import { getTemplate } from "@/content/templates";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { FormLegalNotice } from "@/components/legal/FormLegalNotice";

const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const feePercent = Math.round(CHECKOUT.feeRate * 100);
// A pre-addressed email is the quickest way to cancel (the Terms also allow a call).
const cancelHref = `mailto:${site.contact.email}?subject=${encodeURIComponent(
  "Cancel my hosting plan"
)}&body=${encodeURIComponent(`Please cancel my $${CHECKOUT.monthly}/month Pilk.ai hosting plan.`)}`;

export function CheckoutClient() {
  const params = useSearchParams();
  const template = params.get("template") || "";
  const templateName = getTemplate(template)?.name || template;
  const [selected, setSelected] = useState<AddonKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renewalConsent, setRenewalConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const consentRef = useRef<HTMLInputElement>(null);
  // Worked out in the browser, so it is the buyer's "today", not the build's.
  const [firstCharge, setFirstCharge] = useState<string | null>(null);
  useEffect(() => {
    setFirstCharge(
      firstMonthlyChargeDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    );
  }, []);

  const totals = useMemo(() => priceCents(selected), [selected]);

  const toggle = (k: AddonKey) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  async function pay() {
    if (!renewalConsent) {
      setConsentError(true);
      consentRef.current?.focus();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          addons: selected,
          template,
          renewalConsent: true,
          renewalConsentVersion: RENEWAL_CONSENT_VERSION,
        }),
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
          Your details are saved ✓ — finalizing your{" "}
          <span className="font-medium text-ink">{templateName}</span> build. Pick any add-ons and complete payment to start.
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

          <h3 className="mt-8 font-display text-lg font-semibold">Add-ons (optional)</h3>
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

        <aside className="h-max rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
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
            <div className="flex justify-between gap-4" data-testid="fee-line">
              <dt className="text-muted">
                Fees &amp; processing ({feePercent}%)
                <span className="mt-0.5 block text-xs">
                  {feePercent}% of today&apos;s one-time order. It isn&apos;t added to the monthly plan.
                </span>
              </dt>
              <dd className="whitespace-nowrap">{money(totals.feeCents)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
              <dt>Total due today</dt>
              <dd>{money(totals.totalCents)}</dd>
            </div>
          </dl>

          <section
            aria-labelledby="renewal-heading"
            data-testid="renewal-disclosure"
            className="mt-5 rounded-xl border border-accent/40 bg-[color:var(--accent-soft)] p-4 text-sm"
          >
            <h3 id="renewal-heading" className="font-semibold text-ink">
              Monthly hosting plan: renews automatically
            </h3>
            <dl className="mt-3 space-y-2 text-xs">
              <div>
                <dt className="inline font-semibold text-ink">What renews: </dt>
                <dd className="inline text-muted">hosting, support and edits for your website.</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-ink">Amount: </dt>
                <dd className="inline text-muted">${CHECKOUT.monthly} per month, charged to the card you pay with today.</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-ink">First charge: </dt>
                <dd className="inline text-muted">
                  {firstCharge ? `${firstCharge}, ` : ""}
                  {CHECKOUT.monthlyTrialDays} days after today. Nothing for the plan is charged today.
                </dd>
              </div>
              <div>
                <dt className="inline font-semibold text-ink">Then: </dt>
                <dd className="inline text-muted">${CHECKOUT.monthly} every month on that date until you cancel.</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-ink">How to cancel: </dt>
                <dd className="inline text-muted">
                  email{" "}
                  <a href={cancelHref} className="underline underline-offset-2 hover:text-ink">
                    {site.contact.email}
                  </a>{" "}
                  or call{" "}
                  <a href={site.contact.phoneHref} className="underline underline-offset-2 hover:text-ink">
                    {site.contact.phone}
                  </a>{" "}
                  any time. Cancelling stops the charges after the month you&apos;ve already paid for. Cancel
                  before the first charge and you won&apos;t pay for the plan at all. Your website stays yours.
                </dd>
              </div>
            </dl>
          </section>

          <label
            className={`mt-4 flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm ${
              consentError ? "border-red-500" : "border-line"
            }`}
          >
            <input
              ref={consentRef}
              type="checkbox"
              required
              aria-required="true"
              aria-invalid={consentError || undefined}
              aria-describedby={consentError ? "renewal-consent-error" : undefined}
              className="mt-0.5 h-5 w-5 flex-none"
              checked={renewalConsent}
              onChange={(e) => {
                setRenewalConsent(e.target.checked);
                if (e.target.checked) setConsentError(false);
              }}
            />
            <span data-testid="renewal-consent-text" className="text-ink">
              {RENEWAL_CONSENT_TEXT}
            </span>
          </label>
          {consentError ? (
            <p id="renewal-consent-error" role="alert" className="mt-2 text-sm text-red-500">
              Please tick the box to agree to the ${CHECKOUT.monthly}/month hosting plan before you pay.
            </p>
          ) : null}

          <div className="mt-5">
            <Button variant="primary" onClick={pay} withArrow className="w-full justify-center">
              {loading ? "Starting secure checkout…" : `Pay ${money(totals.totalCents)} with Stripe`}
            </Button>
          </div>
          {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
          <FormLegalNotice variant="pay" className="mt-3 text-center" />
          <p className="mt-3 text-center text-xs text-muted">
            Payments secured by Stripe. Card details never touch our servers.
          </p>
        </aside>
      </div>
    </div>
  );
}
