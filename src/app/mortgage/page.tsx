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

export const metadata: Metadata = buildMetadata({
  title: "Mortgage Website Templates — $500",
  description:
    "15 fully built mortgage website templates for loan officers, brokers, and brokerages. $500 + $100/mo hosting, live in about a week. GoHighLevel connected. Pick your design and start a project.",
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
  "Connected to your GoHighLevel account",
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
              "linear-gradient(180deg, rgba(8,8,11,0.55) 0%, rgba(8,8,11,0.4) 40%, rgba(8,8,11,0.93) 100%)",
          }}
        />
        <Container>
          <div className="on-dark relative z-10 pb-16 pt-[clamp(8rem,20vh,13rem)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Mortgage websites — 15 designs, ready to launch
            </span>
            <h1 className="mt-6 max-w-[16ch] text-balance text-white" style={{ fontSize: "var(--text-hero)" }}>
              Your lending site, live in a week.
            </h1>
            <p className="mt-7 max-w-2xl text-lg text-white/85">
              15 fully built mortgage website designs for loan officers, brokers, and brokerages —
              <span className="text-white font-medium"> $500 flat, plus $100/mo hosting &amp; support.</span>{" "}
              Pick the design you love, tell us about your business, and we build it out as yours —
              connected to your GoHighLevel from day one.
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
                <div className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
                  <p>
                    <span className="font-medium">GoHighLevel connection — included.</span>{" "}
                    <span className="text-muted">Your site is wired to your GHL sub-account from launch.</span>
                  </p>
                  <p>
                    <span className="font-medium">Full GHL build-out — additional cost.</span>{" "}
                    <span className="text-muted">
                      Complete workflows, pipelines, and automations built for your operation. Ask us.
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">MLS connection — +$500.</span>{" "}
                    <span className="text-muted">
                      Requires your MLS API credentials and their ~$50/mo access fee.
                    </span>
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

      {/* GHL upsell */}
      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="03">Beyond the website</SectionLabel>
          <h2 className="mt-6 max-w-[22ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Your website is step one. Your system is the win.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[color:var(--line-on-light)] bg-white p-8">
              <span className="eyebrow text-[color:var(--text-on-light-muted)]">Included with every site</span>
              <h3 className="mt-3 font-display text-2xl font-semibold">GoHighLevel connected</h3>
              <p className="mt-3 text-sm text-[color:var(--text-on-light-muted)]">
                Every lead your website captures flows straight into your GoHighLevel sub-account —
                forms, applications, and calculator leads, all wired at launch.
              </p>
            </div>
            <div className="rounded-2xl border border-accent/40 bg-white p-8">
              <span className="eyebrow text-accent">Additional cost · ask us</span>
              <h3 className="mt-3 font-display text-2xl font-semibold">Full GHL build-out</h3>
              <p className="mt-3 text-sm text-[color:var(--text-on-light-muted)]">
                We build your entire GoHighLevel around your operation — pipelines, automated SMS +
                email follow-up, calendars, nurture sequences, and reporting. You close loans; the
                system works the leads.
              </p>
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
