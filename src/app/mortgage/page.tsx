import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Check } from "lucide-react";
import { templates } from "@/content/templates";
import { buildMetadata, mortgageServiceJsonLd, breadcrumbJsonLd } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { ContactForm } from "@/components/contact/ContactForm";
import { LogoMarquee } from "@/components/sections/LogoMarquee";

export const metadata: Metadata = buildMetadata({
  title: "Mortgage Website Templates — $500",
  description:
    "15 fully built mortgage website templates for loan officers, brokers, and brokerages. $500 + $100/mo hosting, live in about 14 days. GoHighLevel & tracking integrations available. Pick your design and start a project.",
  path: "/mortgage",
  image: "/template-previews/_assets/hero-warm-home.jpg",
});

const mortgageTemplates = templates.filter((t) => t.category === "mortgage");

const included = [
  "Complete multi-page lender website",
  "Working mortgage payment calculator",
  "Loan program pages (FHA, VA, Jumbo & more)",
  "Application & lead-capture forms",
  "Reviews / social proof section",
  "Mobile-first, fast, and secure",
  "Search-engine-ready (SEO) build",
  "Launched on your domain — DNS handled",
];

export default function MortgagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mortgageServiceJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Mortgage Websites", path: "/mortgage" },
            ])
          ),
        }}
      />
      {/* Hero */}
      <header
        className="relative z-10 flex min-h-[80vh] items-end overflow-hidden"
      >
        <div
          aria-hidden
          className="kenburns absolute inset-0"
          style={{
            backgroundImage: "url('/template-previews/_assets/hero-warm-home.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "var(--photo-scrim)",
          }}
        />
        <Container>
          <div className="on-dark relative z-10 pb-16 pt-[clamp(8rem,20vh,13rem)]">
            <span className="hero-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] backdrop-blur-sm">
              Mortgage websites — 15 designs, ready to launch
            </span>
            <h1 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-hero)" }}>
              Your lending site, live in 14 days.
            </h1>
            <p className="mt-7 max-w-2xl text-lg text-muted">
              15 fully built mortgage website designs for loan officers, brokers, and brokerages —
              <span className="text-ink font-medium"> $500 flat, plus $100/mo hosting &amp; support.</span>{" "}
              Pick the design you love, tell us about your business, and we build it out as yours —
              ready to plug into GoHighLevel, Google &amp; Meta whenever you add them.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="#designs" variant="primary" withArrow>
                Browse the 15 designs
              </Button>
              <Button href="#inquire" variant="ghost">
                Start a project
              </Button>
            </div>
                <p className="mt-3 text-xs text-muted">Already picked your design? <Link href="/checkout" className="text-accent hover:underline">Go straight to checkout →</Link></p>
          </div>
        </Container>
      </header>

      <LogoMarquee />

      {/* What's included / pricing */}
      <section className="section relative z-10 pt-14">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <SectionLabel index="01">The offer</SectionLabel>
              <h2 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
                $500. Fully built. Yours.
              </h2>
              <p className="mt-4 max-w-xl text-muted">
                Every template is a complete, professional lending website — not a starting point.
                You pick the design, we tailor it with your brand, your programs, your NMLS, and
                launch it on your domain.
              </p>
              <div className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {included.map((f) => (
                  <div key={f} className="flex gap-2.5 text-sm">
                    <Check size={16} className="mt-0.5 flex-none text-accent" aria-hidden />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <Reveal delay={100}>
              <div className="rounded-3xl border border-accent/50 bg-[color:var(--accent-soft)] p-8">
                <span className="eyebrow text-accent">Simple pricing</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-semibold">$500</span>
                  <span className="text-muted">one-time build</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-semibold">+$100</span>
                  <span className="text-muted">/mo hosting, support &amp; edits</span>
                </div>
                <div className="mt-6 space-y-4 border-t border-line pt-5 text-sm">
                  <div>
                    <p className="font-medium">Optional add-ons — $100 each, at checkout</p>
                    <p className="mt-1 text-muted">
                      GoHighLevel connection · Google tag + analytics · Meta Pixel · PostHog · 5-day rush delivery.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Bigger builds — priced separately, ask us</p>
                    <p className="mt-1 text-muted">
                      Full GoHighLevel build-out (pipelines + automations) · MLS connection (+$500; needs your MLS API + ~$50/mo).
                    </p>
                  </div>
                  <p className="text-xs text-muted">
                    The $500 + $100/mo covers your website. Everything above is optional and priced on top.
                  </p>
                </div>
                <div className="mt-7">
                  <Button href="#designs" variant="primary" withArrow>
                    Pick your design
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* The 15 designs */}
      <section id="designs" className="section relative z-10 pt-6">
        <Container>
          <SectionLabel index="02">Choose your design</SectionLabel>
          <h2 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            15 mortgage designs. One is yours.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Every design is a real, browsable website — click any of them and walk through it like a
            client would. Found the one? Hit{" "}
            <span className="text-ink">Start With This Design</span> and tell us about your business.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mortgageTemplates.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </div>
        </Container>
      </section>

      {/* Beyond the website — CRM build-out + tracking (paid add-ons) */}
      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="03">Beyond the website</SectionLabel>
          <h2 className="mt-6 max-w-[26ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Your website is step one. The system behind it is where you win.
          </h2>

          <div className="mt-6 max-w-3xl rounded-xl border border-accent/40 bg-[color:var(--accent-soft)] p-4 text-sm">
            <span className="font-semibold">To be clear on pricing:</span> the{" "}
            <span className="font-semibold">$500 builds your website</span> and{" "}
            <span className="font-semibold">$100/mo</span> covers hosting &amp; support. The CRM
            build-out and tracking below are{" "}
            <span className="font-semibold">separate, paid services</span> — added on top, never
            rolled into the $500.
          </div>

          <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="eyebrow text-accent">GoHighLevel CRM · separate build-out</span>
              <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
                Your CRM, fully built out — automations that work your leads for you.
              </h3>
              <p className="mt-4 text-[color:var(--text-on-light-muted)]">
                We don&apos;t just connect your site to GoHighLevel — we build the whole engine: a
                sales pipeline, automated SMS &amp; email follow-up, nurture sequences, booking
                calendars, and reporting. Every lead gets worked the second it lands, even while
                you sleep.
              </p>
              <ul className="mt-5 grid gap-2 text-sm">
                {[
                  "Custom pipeline + deal stages",
                  "Automated text & email follow-up",
                  "Nurture & re-engagement workflows",
                  "Booking calendars + reminders",
                  "Dashboards & reporting",
                ].map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check size={16} className="mt-0.5 flex-none text-accent" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 inline-block rounded-full border border-[color:var(--line-on-light)] px-4 py-1.5 text-xs font-medium">
                Separate build-out · priced by your operation · not included in the $500
              </p>
            </div>
            <div className="rounded-2xl bg-[#0c0c11] p-4 shadow-2xl ring-1 ring-white/10">
              <div className="flex items-center gap-1.5 border-b border-white/10 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-2 text-[11px] text-white/40">PILK AI · pipeline</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  { s: "New Lead", n: "4", c: ["Maria L.", "Devon R."] },
                  { s: "Intake", n: "2", c: ["James T."] },
                  { s: "Paid", n: "3", c: ["Priya K."] },
                  { s: "Active", n: "11", c: ["+ 8 more"] },
                ].map((col) => (
                  <div key={col.s} className="rounded-lg bg-white/[0.04] p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-wide text-white/40">{col.s}</span>
                      <span className="text-[9px] text-accent">{col.n}</span>
                    </div>
                    <div className="mt-1.5 space-y-1">
                      {col.c.map((card) => (
                        <div key={card} className="rounded bg-white/[0.06] px-1.5 py-1 text-[9px] text-white/60">
                          {card}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-accent/10 p-2.5 ring-1 ring-accent/30">
                <div className="text-[9px] uppercase tracking-wide text-accent">Automation · live</div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[9px] text-white/60">
                  {["New lead", "Auto text", "Email drip", "Task for you", "Booked call"].map((step, i) => (
                    <span key={step} className="flex items-center gap-1">
                      <span className="rounded bg-white/10 px-1.5 py-0.5">{step}</span>
                      {i < 4 ? <span className="text-white/30">→</span> : null}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid items-center gap-8 lg:grid-cols-2">
            <div className="lg:order-2">
              <span className="eyebrow text-accent">Tracking &amp; analytics · add-on</span>
              <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
                Know exactly what&apos;s working — down to the lead.
              </h3>
              <p className="mt-4 text-[color:var(--text-on-light-muted)]">
                We install Google Analytics 4 and the Google tag so every visit, form, and
                application is tracked. See where your leads come from, what your cost-per-lead is,
                and which ad dollars turn into closings — then retarget the rest.
              </p>
              <p className="mt-6 inline-block rounded-full border border-[color:var(--line-on-light)] px-4 py-1.5 text-xs font-medium">
                Add-on · $100 at checkout · not included in the $500
              </p>
            </div>
            <div className="rounded-2xl bg-[#0c0c11] p-4 shadow-2xl ring-1 ring-white/10 lg:order-1">
              <div className="flex items-center gap-1.5 border-b border-white/10 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-2 text-[11px] text-white/40">your-site · analytics</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { k: "Visitors", v: "2,481" },
                  { k: "Leads", v: "143" },
                  { k: "Cost / lead", v: "$12" },
                ].map((t) => (
                  <div key={t.k} className="rounded-lg bg-white/[0.04] p-2.5">
                    <div className="text-[9px] uppercase tracking-wide text-white/40">{t.k}</div>
                    <div className="mt-1 text-lg font-semibold text-white">{t.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex h-16 items-end gap-1.5">
                {[38, 52, 45, 68, 60, 82, 74].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-accent/70" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Start a project */}
      <section id="inquire" className="section relative z-10">
        <Container>
          <SectionLabel index="04">Start a project</SectionLabel>
          <h2 className="mb-10 mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Found your design? Let&apos;s build it.
          </h2>
          <div className="max-w-2xl">
            <Suspense fallback={null}>
              <ContactForm realEstate />
            </Suspense>
          </div>
          <p className="mt-6 max-w-xl text-sm text-muted">
            Prefer the full brief?{" "}
            <Link href="/contact?projectType=template&service=mortgage" className="text-accent hover:underline">
              Start a Project
            </Link>{" "}
            walks you through everything we need to build your site.
          </p>
        </Container>
      </section>
    </>
  );
}
