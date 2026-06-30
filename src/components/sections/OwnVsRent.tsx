import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Own it, don't rent it" — the core argument against subscription website
 * platforms (Placester and similar): you rent a shared template forever and
 * own nothing. Pilk.ai builds you a custom site you own outright.
 *
 * variant="section" → compact block for the Real Estate page (links to full page).
 * variant="page"    → full standalone comparison for /own-vs-rent.
 */
const rentPoints = [
  "You rent it — the site lives on their platform",
  "Stop paying and it goes offline. You keep nothing",
  "Shared templates & modules every other agent also uses",
  "You build and maintain it yourself",
  "$59–$599/mo, forever",
];

const ownPoints = [
  "You own the site, the code, and the files outright",
  "Cancel support anytime — host it anywhere, it's yours",
  "Custom, one-of-one design (or a premium template)",
  "Done for you — we build and can maintain it",
  "Pay once to own · optional $199/mo support, no contract",
];

const rows: { label: string; rent: string; own: string }[] = [
  { label: "Who owns the website", rent: "Placester — you license it", own: "You — outright, forever" },
  { label: "If you stop paying", rent: "Site goes offline, you lose it", own: "It's yours — move it anywhere" },
  { label: "Design", rent: "Shared templates & modules", own: "Custom, built around your brand" },
  { label: "Who builds it", rent: "You (DIY via their editor)", own: "We do — done for you" },
  { label: "Customization", rent: "Limited to platform modules", own: "Unlimited — even a scroll-through listing film" },
  { label: "Leads & data", rent: "Live inside their platform", own: "Yours and portable (GHL CRM available)" },
  { label: "Pricing", rent: "$59–$599/mo, indefinitely", own: "One-time build + optional $199/mo support" },
  { label: "Lock-in", rent: "Platform lock-in", own: "None — your domain, code, host" },
];

function ComparisonCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-2xl border border-line bg-surface p-7">
        <span className="eyebrow text-muted">Renting a platform · e.g. Placester</span>
        <h3 className="mt-3 text-xl font-medium">You rent. They own.</h3>
        <ul className="mt-5 space-y-3 text-sm text-muted">
          {rentPoints.map((p) => (
            <li key={p} className="flex gap-3">
              <span className="mt-2 h-1 w-1 flex-none rounded-full bg-muted/60" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-accent/50 bg-[color:var(--accent-soft)] p-7">
        <span className="eyebrow text-accent">Building with Pilk.ai</span>
        <h3 className="mt-3 text-xl font-medium">You own it. For good.</h3>
        <ul className="mt-5 space-y-3 text-sm">
          {ownPoints.map((p) => (
            <li key={p} className="flex gap-3">
              <span className="mt-2 h-1 w-1 flex-none rounded-full bg-accent" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function OwnVsRent({ variant = "section" }: { variant?: "section" | "page" }) {
  if (variant === "section") {
    return (
      <section className="section relative z-10">
        <Container>
          <SectionLabel index="05">Own it, don&apos;t rent it</SectionLabel>
          <h2 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            A rented website disappears the day you stop paying.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Platforms like Placester rent you a template-based site for $59–$599/month — forever.
            Stop paying and it&apos;s gone. We build you a custom site you own outright, with support
            that&apos;s optional and month-to-month.
          </p>
          <div className="mt-12">
            <ComparisonCards />
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/own-vs-rent" variant="primary" withArrow>
              See the full comparison
            </Button>
            <Button href="/contact?projectType=custom&service=real-estate" variant="ghost">
              Start a project
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  // Full page variant
  return (
    <>
      <header className="relative z-10 pb-6 pt-[clamp(7rem,18vh,12rem)]">
        <Container>
          <SectionLabel>Own it, don&apos;t rent it</SectionLabel>
          <h1 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-hero)" }}>
            Stop renting your website.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted">
            Subscription builders like Placester hand every agent the same template and bill you
            every month for the privilege. The day you stop paying, your site — and everything on
            it — disappears. Pilk.ai builds you a custom website you actually own.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact?projectType=custom&service=real-estate" variant="primary" withArrow>
              Build a site you own
            </Button>
            <Button href="/real-estate#designs" variant="ghost">
              See real estate designs
            </Button>
          </div>
        </Container>
      </header>

      <section className="section relative z-10 pt-6">
        <Container>
          <ComparisonCards />
        </Container>
      </section>

      {/* Full comparison table */}
      <section className="section relative z-10">
        <Container>
          <SectionLabel index="01">Side by side</SectionLabel>
          <h2 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Pilk.ai vs. a rented platform.
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl border border-line">
            <div className="grid grid-cols-3 border-b border-line bg-surface text-sm font-medium">
              <div className="p-4 sm:p-5"> </div>
              <div className="border-l border-line p-4 text-muted sm:p-5">Placester (rent)</div>
              <div className="border-l border-line p-4 text-accent sm:p-5">Pilk.ai (own)</div>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.label}
                className={`grid grid-cols-3 text-sm ${i % 2 ? "bg-surface/40" : ""}`}
              >
                <div className="p-4 font-medium sm:p-5">{r.label}</div>
                <div className="border-l border-line p-4 text-muted sm:p-5">{r.rent}</div>
                <div className="border-l border-line p-4 sm:p-5">{r.own}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-xs text-muted">
            Placester details reflect their publicly published plans (placester.com/pricing) as of
            June 2026 and may change. Shown for honest comparison, not affiliated with or endorsed by
            Placester.
          </p>
        </Container>
      </section>

      {/* Lifetime cost */}
      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="02">The math</SectionLabel>
          <h2 className="mt-6 max-w-[22ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Rent forever, or own the asset.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                h: "Renting a team site",
                v: "≈ $24,000",
                s: "Placester Broker Standard at $399/mo over 5 years — and you own nothing at the end.",
              },
              {
                h: "Renting an agent site",
                v: "≈ $7,700",
                s: "Agent Premier at $129/mo over 5 years. Still a shared template. Still not yours.",
              },
              {
                h: "Owning with Pilk.ai",
                v: "One-time build",
                s: "From $750 (template) to $2,500+ (custom). You own it. Support is optional at $199/mo, cancel anytime.",
              },
            ].map((c, i) => (
              <Reveal key={c.h} delay={i * 70}>
                <div className="rounded-2xl border border-[color:var(--line-on-light)] p-7">
                  <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-on-light-muted)]">
                    {c.h}
                  </div>
                  <div className="mt-3 font-display text-3xl font-semibold">{c.v}</div>
                  <p className="mt-3 text-sm text-[color:var(--text-on-light-muted)]">{c.s}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-xs text-[color:var(--text-on-light-muted)]">
            Illustrative. A solo agent can start cheaper on a rented plan — the difference is that
            with us you own a custom asset instead of renting a shared one. For teams and brokerages,
            owning is also far cheaper over time.
          </p>
        </Container>
      </section>

      {/* What you own */}
      <section className="section relative z-10">
        <Container>
          <SectionLabel index="03">What you actually get</SectionLabel>
          <h2 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            A real asset, not a monthly bill.
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Your website, code, and content — owned outright",
              "A custom design no other agent has",
              "Your own domain and hosting (host anywhere)",
              "Leads and CRM data that are yours and portable",
              "Optional GoHighLevel CRM built to run your business",
              "Support that's month-to-month, never a contract",
            ].map((f, i) => (
              <Reveal key={f} delay={i * 50} className="border-t border-line pt-4 text-sm">
                {f}
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="section relative z-10">
        <Container>
          <div className="rounded-3xl border border-accent/40 bg-[color:var(--accent-soft)] p-10 text-center sm:p-14">
            <h2 className="mx-auto max-w-[20ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
              Own your presence. Build it once, keep it for good.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Tell us about your business and we&apos;ll show you what a site you own can look like.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/contact?projectType=custom&service=real-estate" variant="primary" withArrow>
                Start a project
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
