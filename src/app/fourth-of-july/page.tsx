import type { Metadata } from "next";
import Link from "next/link";
import { Star, Check } from "lucide-react";
import { templates } from "@/content/templates";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { TemplateCard } from "@/components/templates/TemplateCard";

export const metadata: Metadata = buildMetadata({
  title: "4th of July Sale — $499 Websites",
  description:
    "Independence Day Sale: custom real estate & mortgage websites for $499. Add a GoHighLevel CRM build-out for $250 and optional ManyChat Instagram automations. Don't miss out.",
  path: "/fourth-of-july",
});

const NAVY = "#0a1a3f";
const NAVY_DEEP = "#060f26";
const RED = "#c8102e";

const saleTemplates = templates.filter((t) => t.slug !== "custom-site");

// Subtle star field (data-URI SVG).
const stars =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cg fill='%23ffffff' fill-opacity='0.10'%3E%3Ccircle cx='20' cy='30' r='1.3'/%3E%3Ccircle cx='90' cy='18' r='1'/%3E%3Ccircle cx='120' cy='70' r='1.4'/%3E%3Ccircle cx='55' cy='95' r='1'/%3E%3Ccircle cx='15' cy='115' r='1.2'/%3E%3Ccircle cx='100' cy='120' r='1'/%3E%3C/g%3E%3C/svg%3E\")";

function Stripe() {
  return (
    <div
      aria-hidden
      className="h-1.5 w-full"
      style={{
        background: `repeating-linear-gradient(90deg, ${RED} 0, ${RED} 44px, #ffffff 44px, #ffffff 88px)`,
      }}
    />
  );
}

export default function FourthOfJulyPage() {
  return (
    <div
      className="relative"
      style={{
        background: `radial-gradient(120% 80% at 50% -10%, ${NAVY} 0%, ${NAVY_DEEP} 60%, #04091a 100%)`,
        color: "#ffffff",
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: stars }} />
      <Stripe />

      {/* Hero */}
      <header className="relative z-10">
        <Container>
          <div className="mx-auto max-w-4xl pb-16 pt-[clamp(7rem,16vh,11rem)] text-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)", color: "#fff" }}
            >
              <Star size={13} fill="#fff" aria-hidden /> Independence Day Sale · Limited Time
            </span>
            <h1 className="mt-7 text-balance font-display font-semibold" style={{ fontSize: "var(--text-hero)", lineHeight: 0.98 }}>
              $499 Websites
              <span className="mt-2 block" style={{ color: RED, fontSize: "0.5em" }}>
                This 4th of July only
              </span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg text-white/80">
              Upgrade your online presence this Independence Day. A custom real estate or mortgage
              website — professionally built, ready to capture leads — for a flat{" "}
              <span className="font-semibold text-white">$499</span>. Don&apos;t miss out.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#offer"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: RED }}
              >
                Don&apos;t miss out →
              </a>
              <Link
                href="/contact?projectType=template&promo=july4"
                className="inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
              >
                Claim the deal
              </Link>
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/45">
              Real estate &amp; mortgage professionals · Built by Pilk.ai
            </p>
          </div>
        </Container>
      </header>

      {/* $499 offer — two example buttons */}
      <section id="offer" className="relative z-10 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance font-display font-semibold" style={{ fontSize: "var(--text-2xl)" }}>
              Pick your $499 website.
            </h2>
            <p className="mt-4 text-white/75">
              Two ready-to-go builds — see a real, live example of each, then claim yours.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            {[
              {
                label: "Mortgage",
                title: "Mortgage Website",
                blurb: "A trust-driven lender site with loan programs, calculators, and a clean application path.",
                href: "https://homewithrichard.com",
                example: "Home with Richard",
              },
              {
                label: "Real Estate",
                title: "Real Estate Website",
                blurb: "A polished agent site with listings, neighborhoods, reviews, and lead capture built in.",
                href: "https://tocadorealty.com",
                example: "Tocado Realty",
              },
            ].map((o) => (
              <Reveal key={o.title}>
                <div
                  className="flex h-full flex-col rounded-3xl border p-8"
                  style={{ borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)" }}
                >
                  <span className="eyebrow" style={{ color: RED }}>{o.label}</span>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-white">{o.title}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-semibold text-white">$499</span>
                    <span className="text-sm text-white/50">flat, built for you</span>
                  </div>
                  <p className="mt-4 flex-1 text-sm text-white/75">{o.blurb}</p>
                  <a
                    href={o.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                    style={{ background: RED }}
                  >
                    See the live {o.label.toLowerCase()} site ↗
                  </a>
                  <span className="mt-3 text-center text-xs text-white/45">Live example: {o.example}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/contact?projectType=template&promo=july4"
              className="inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)" }}
            >
              Claim your $499 website →
            </Link>
          </div>
        </Container>
      </section>

      <div className="relative z-10">
        <Container>
          <Stripe />
        </Container>
      </div>

      {/* Add-ons */}
      <section className="relative z-10 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow text-white/60">Power it up</span>
            <h2 className="mt-4 text-balance font-display font-semibold" style={{ fontSize: "var(--text-2xl)" }}>
              Turn your website into a lead machine.
            </h2>
            <p className="mt-4 text-white/75">
              Add automation and follow-up so every lead gets worked — even while you&apos;re closing.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            {/* GHL */}
            <Reveal>
              <div
                className="flex h-full flex-col rounded-3xl border p-8"
                style={{ borderColor: RED, background: "rgba(200,16,46,0.08)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow" style={{ color: RED }}>Most popular add-on</span>
                  <span className="font-display text-2xl font-semibold text-white">$250</span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                  GoHighLevel Build-Out &amp; Integration
                </h3>
                <p className="mt-3 text-sm text-white/75">
                  A complete CRM wired into your new site — so leads never fall through the cracks.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-white/80">
                  {[
                    "Full GoHighLevel setup & integration",
                    "Lead pipelines & stages",
                    "Automated SMS + email follow-up",
                    "Calendars & booking automation",
                    "Forms, funnels & nurture sequences",
                  ].map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check size={16} className="mt-0.5 flex-none" style={{ color: RED }} aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact?projectType=custom&promo=july4&package=ghl"
                  className="mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: RED }}
                >
                  Add GHL build-out →
                </Link>
              </div>
            </Reveal>

            {/* ManyChat */}
            <Reveal delay={80}>
              <div
                className="flex h-full flex-col rounded-3xl border p-8"
                style={{ borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-white/55">For real estate agents</span>
                  <span className="rounded-full border px-3 py-1 text-xs text-white/70" style={{ borderColor: "rgba(255,255,255,0.25)" }}>
                    Optional add-on
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                  ManyChat Instagram Automations
                </h3>
                <p className="mt-3 text-sm text-white/75">
                  Capture and reply to leads in your Instagram DMs 24/7 — automatically turning
                  followers into booked conversations.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-white/80">
                  {[
                    "Auto-reply to comments & DMs",
                    "Lead capture straight from Instagram",
                    "Story & post keyword triggers",
                    "Hands-off follow-up flows",
                  ].map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check size={16} className="mt-0.5 flex-none text-white/70" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact?projectType=custom&promo=july4&package=manychat"
                  className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.3)" }}
                >
                  Ask about ManyChat →
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Templates — additional site options */}
      <section className="relative z-10 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow text-white/60">More options</span>
            <h2 className="mt-4 text-balance font-display font-semibold" style={{ fontSize: "var(--text-2xl)" }}>
              Prefer a different look? Start from a design.
            </h2>
            <p className="mt-4 text-white/75">
              Any of these can be your website too — pick a style and we&apos;ll make it yours.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {saleTemplates.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 pb-24">
        <Container>
          <div
            className="mx-auto max-w-3xl rounded-3xl border p-10 text-center sm:p-14"
            style={{ borderColor: "rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.05)" }}
          >
            <div className="mb-4 flex justify-center gap-1.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <Star key={i} size={16} fill="#fff" className="text-white" />
              ))}
            </div>
            <h2 className="mx-auto max-w-[20ch] text-balance font-display font-semibold" style={{ fontSize: "var(--text-2xl)" }}>
              Don&apos;t miss out — upgrade your online presence.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/75">
              $499 websites this Independence Day only. Claim yours before the fireworks fade.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact?projectType=template&promo=july4"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: RED }}
              >
                Claim your $499 website →
              </Link>
              <Link
                href="/inquiry"
                className="inline-flex items-center gap-2 rounded-full border px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
              >
                Inquiry now
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Stripe />
    </div>
  );
}
