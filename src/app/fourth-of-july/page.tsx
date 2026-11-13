import type { Metadata } from "next";
import Link from "next/link";
import { Star, Check } from "lucide-react";
import { templates } from "@/content/templates";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { InquiryForm } from "@/components/contact/InquiryForm";

export const metadata: Metadata = buildMetadata({
  title: "4th of July Sale — $499 Websites",
  description:
    "Independence Day Sale: custom real estate & mortgage websites for $499. Add a GoHighLevel CRM build-out for $250 and optional ManyChat Instagram automations. Don't miss out.",
  path: "/fourth-of-july",
  noindex: true,
});

const saleTemplates = templates.filter((t) => t.slug !== "custom-site");

/** Small red / white / blue star accent — the 4th of July flavor. */
function TriStars({ size = 13 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      <Star size={size} fill="#e11d2a" className="text-[#e11d2a]" />
      <Star size={size} fill="#ffffff" className="text-white" />
      <Star size={size} fill="#3b82f6" className="text-[#3b82f6]" />
    </span>
  );
}

export default function FourthOfJulyPage() {
  return (
    <>
      {/* Hero — brand header pattern */}
      <header className="relative z-10 pb-8 pt-[clamp(7rem,18vh,12rem)]">
        <Container>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            <TriStars /> Independence Day Sale
          </span>
          <h1 className="mt-6 max-w-[14ch] text-balance" style={{ fontSize: "var(--text-hero)" }}>
            $499 websites this 4th of July.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted">
            Upgrade your online presence this Independence Day. A custom real estate or mortgage
            website — professionally built and ready to capture leads — for a flat{" "}
            <span className="text-ink">$499</span>. Don&apos;t miss out.
          </p>
          <div className="mt-4 text-sm text-muted">See a real $499 site we built — live:</div>
          <div className="mt-4 max-w-xl">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <a
                href="https://homewithrichard.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full justify-center text-center"
              >
                Mortgage site ↗
              </a>
              <a
                href="https://tocadorealty.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full justify-center text-center"
              >
                Real estate site ↗
              </a>
            </div>
            <div className="mt-3 flex justify-center sm:mt-4">
              <Button href="#claim" variant="ghost">
                Claim the deal
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* $499 offer — two example buttons */}
      <section id="offer" className="section relative z-10 pt-8">
        <Container>
          <SectionLabel index="01">The offer</SectionLabel>
          <h2 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Pick your $499 website.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Two ready-to-go builds — see a real, live example of each, then claim yours.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
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
                <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-8">
                  <span className="eyebrow text-accent">{o.label}</span>
                  <h3 className="mt-3 font-display text-2xl font-semibold">{o.title}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-semibold">$499</span>
                    <span className="text-sm text-muted">flat, built for you</span>
                  </div>
                  <p className="mt-4 flex-1 text-sm text-muted">{o.blurb}</p>
                  <a href={o.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6 justify-center">
                    See the live {o.label.toLowerCase()} site ↗
                  </a>
                  <span className="mt-3 text-center text-xs text-muted">Live example: {o.example}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10">
            <Button href="#claim" variant="ghost" withArrow>
              Claim your $499 website
            </Button>
          </div>
        </Container>
      </section>

      {/* Add-ons */}
      <section className="section relative z-10">
        <Container>
          <SectionLabel index="02">Power it up</SectionLabel>
          <h2 className="mt-6 max-w-[22ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Turn your website into a lead machine.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Add automation and follow-up so every lead gets worked — even while you&apos;re closing.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* GHL — highlighted like the brand's popular tier */}
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border border-accent bg-[color:var(--accent-soft)] p-8">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                    Most popular add-on
                  </span>
                  <span className="font-display text-2xl font-semibold">$250</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold">
                  GoHighLevel Build-Out &amp; Integration
                </h3>
                <p className="mt-3 text-sm text-muted">
                  A complete CRM wired into your new site — so leads never fall through the cracks.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {[
                    "Full GoHighLevel setup & integration",
                    "Lead pipelines & stages",
                    "Automated SMS + email follow-up",
                    "Calendars & booking automation",
                    "Forms, funnels & nurture sequences",
                  ].map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check size={16} className="mt-0.5 flex-none text-accent" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Button href="/contact?projectType=custom&promo=july4&package=ghl" variant="primary" withArrow>
                    Add GHL build-out
                  </Button>
                </div>
              </div>
            </Reveal>

            {/* ManyChat — optional, no price */}
            <Reveal delay={80}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-8">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-muted">For real estate agents</span>
                  <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                    Optional add-on
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold">
                  ManyChat Instagram Automations
                </h3>
                <p className="mt-3 text-sm text-muted">
                  Capture and reply to leads in your Instagram DMs 24/7 — automatically turning
                  followers into booked conversations.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {[
                    "Auto-reply to comments & DMs",
                    "Lead capture straight from Instagram",
                    "Story & post keyword triggers",
                    "Hands-off follow-up flows",
                  ].map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check size={16} className="mt-0.5 flex-none text-muted" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Button href="/contact?projectType=custom&promo=july4&package=manychat" variant="ghost" withArrow>
                    Ask about ManyChat
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Templates — additional options */}
      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="03">More options</SectionLabel>
          <h2 className="mt-6 max-w-[22ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Prefer a different look? Start from a design.
          </h2>
          <p className="mt-4 max-w-2xl text-[color:var(--text-on-light-muted)]">
            Any of these can be your website too — pick a style and we&apos;ll make it yours.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {saleTemplates.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </div>
        </Container>
      </section>

      {/* Claim — basic lead form */}
      <section id="claim" className="section relative z-10">
        <Container>
          <SectionLabel index="04">Claim the deal</SectionLabel>
          <h2 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Claim your $499 website.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Drop your details and we&apos;ll reach out to lock in your Independence Day price. No
            commitment — just a quick hello.
          </p>
          <div className="mt-10">
            <InquiryForm
              intent="4th of July $499 website — please reach out to lock in the deal."
              submitLabel="Claim my $499 website"
            />
          </div>
        </Container>
      </section>

      {/* Final CTA — brand accent card with 4th of July stars */}
      <section className="section relative z-10">
        <Container>
          <div className="mx-auto max-w-3xl rounded-3xl border border-accent/40 bg-[color:var(--accent-soft)] p-10 text-center sm:p-14">
            <div className="mb-5 flex justify-center">
              <TriStars size={18} />
            </div>
            <h2 className="mx-auto max-w-[20ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
              Don&apos;t miss out — upgrade your online presence.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              $499 websites this Independence Day only. Claim yours before the fireworks fade.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="#claim" variant="primary" withArrow>
                Claim your $499 website
              </Button>
              <Button href="/inquiry" variant="ghost">
                Inquiry now
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
