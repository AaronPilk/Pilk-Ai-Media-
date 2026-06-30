import { Check, X, KeyRound, Building2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const A = "/template-previews/_assets";

/**
 * "Own it, don't rent it" — the real-estate-specific case against subscription
 * website platforms (Placester and similar). variant="section" is the compact
 * block on /real-estate; variant="page" is the full standalone /own-vs-rent.
 */

// Real-estate-specific face-off rows.
const faceoff: { label: string; rent: string; own: string }[] = [
  { label: "Your listings & galleries", rent: "Live on their platform", own: "On your domain, forever" },
  { label: "Your leads & contacts", rent: "Locked in their CRM", own: "Yours — exportable, in your pipeline" },
  { label: "Your IDX / MLS feed", rent: "Tied to their subscription", own: "Connected to a site you control" },
  { label: "Local SEO (neighborhood pages)", rent: "Equity built on rented land", own: "Ranking equity on a domain you own" },
  { label: "Your agent brand", rent: "A template other agents also use", own: "A one-of-one custom design" },
  { label: "Who builds & maintains it", rent: "You do (DIY editor)", own: "We do — done for you" },
  { label: "Monthly cost", rent: "$59–$599 / mo — forever", own: "One-time build · support optional" },
  { label: "If you stop paying", rent: "It all goes dark", own: "Nothing changes — it's yours" },
];

const rentList = [
  "You rent it — the site lives on their servers",
  "Stop paying and your site, listings, and leads vanish",
  "The same template thousands of other agents use",
  "$59–$599/month, every month you're in business",
];

const ownList = [
  "You own the site, the code, and the content outright",
  "Your domain, your hosting, your leads — fully portable",
  "A custom design built around your market and brand",
  "Pay once to own · optional $199/mo support, cancel anytime",
];

function FaceOff() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line">
      <div className="grid grid-cols-[1.1fr_1fr_1fr]">
        <div className="bg-surface p-4 sm:p-5" />
        <div className="border-l border-line bg-surface p-4 sm:p-5">
          <div className="flex items-center gap-2 text-muted">
            <Building2 size={16} aria-hidden />
            <span className="text-sm font-medium">Renting · Placester</span>
          </div>
        </div>
        <div className="border-l border-line bg-[color:var(--accent-soft)] p-4 sm:p-5">
          <div className="flex items-center gap-2 text-accent">
            <KeyRound size={16} aria-hidden />
            <span className="text-sm font-medium">Owning · Pilk.ai</span>
          </div>
        </div>
      </div>
      {faceoff.map((r, i) => (
        <div key={r.label} className={`grid grid-cols-[1.1fr_1fr_1fr] border-t border-line ${i % 2 ? "bg-surface/30" : ""}`}>
          <div className="p-4 text-sm font-medium sm:p-5">{r.label}</div>
          <div className="flex items-start gap-2 border-l border-line p-4 text-sm text-muted sm:p-5">
            <X size={16} className="mt-0.5 flex-none text-muted/70" aria-hidden />
            <span>{r.rent}</span>
          </div>
          <div className="flex items-start gap-2 border-l border-line p-4 text-sm sm:p-5">
            <Check size={16} className="mt-0.5 flex-none text-accent" aria-hidden />
            <span>{r.own}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OwnVsRent({ variant = "section" }: { variant?: "section" | "page" }) {
  if (variant === "section") {
    return (
      <section className="section relative z-10">
        <Container>
          <SectionLabel index="05">Own it, don&apos;t rent it</SectionLabel>
          <h2 className="mt-6 max-w-[22ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            A rented real estate site disappears the day you stop paying.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Platforms like Placester rent you a template site — with your listings, leads, and local
            SEO living on their servers — for $59–$599/month, forever. We build you a custom site you
            own outright.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-7">
              <div className="flex items-center gap-2 text-muted">
                <Building2 size={18} aria-hidden />
                <span className="eyebrow">Renting a platform</span>
              </div>
              <h3 className="mt-3 text-xl font-medium">You rent. They own.</h3>
              <ul className="mt-5 space-y-3 text-sm text-muted">
                {rentList.map((p) => (
                  <li key={p} className="flex gap-3">
                    <X size={16} className="mt-0.5 flex-none text-muted/70" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-accent/50 bg-[color:var(--accent-soft)] p-7">
              <div className="flex items-center gap-2 text-accent">
                <KeyRound size={18} aria-hidden />
                <span className="eyebrow">Building with Pilk.ai</span>
              </div>
              <h3 className="mt-3 text-xl font-medium">You own it. For good.</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {ownList.map((p) => (
                  <li key={p} className="flex gap-3">
                    <Check size={16} className="mt-0.5 flex-none text-accent" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
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

  // ---- Full page variant ----
  return (
    <>
      {/* House hero */}
      <header className="relative z-10 flex min-h-[78vh] items-end overflow-hidden">
        <div
          aria-hidden
          className="kenburns absolute inset-0"
          style={{
            backgroundImage: `url('${A}/hero-luxury-exterior.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,11,0.55) 0%, rgba(8,8,11,0.42) 40%, rgba(8,8,11,0.93) 100%)",
          }}
        />
        <Container>
          <div className="relative z-10 pb-14 pt-[clamp(8rem,20vh,13rem)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              For real estate agents, teams &amp; brokers
            </span>
            <h1 className="mt-6 max-w-[16ch] text-balance text-white" style={{ fontSize: "var(--text-hero)" }}>
              Don&apos;t rent your real estate website. Own it.
            </h1>
            <p className="mt-7 max-w-2xl text-lg text-white/85">
              Platforms like Placester rent agents a template site — and keep your listings, leads,
              and local search history on their servers. Pilk.ai builds you a custom real estate
              website you own outright, with everything that matters staying yours.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/contact?projectType=custom&service=real-estate" variant="primary" withArrow>
                Build a site you own
              </Button>
              <Button href="/real-estate#designs" variant="ghost">
                See real estate designs
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* The face-off */}
      <section className="section relative z-10">
        <Container>
          <SectionLabel index="01">Rent vs. own</SectionLabel>
          <h2 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Same website. Completely different deal.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Here&apos;s what actually changes for a real estate professional, line by line.
          </p>
          <div className="mt-10">
            <FaceOff />
          </div>
          <p className="mt-4 max-w-3xl text-xs text-muted">
            Placester details reflect their publicly published plans (placester.com/pricing) as of
            June 2026 and may change. Shown for honest comparison — not affiliated with or endorsed by
            Placester.
          </p>
        </Container>
      </section>

      {/* The day you stop paying */}
      <section className="section relative z-10 pt-0">
        <Container>
          <SectionLabel index="02">The moment that matters</SectionLabel>
          <h2 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            What happens the day you stop paying?
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-line bg-surface p-8">
              <div className="flex items-center gap-2 text-muted">
                <Building2 size={18} aria-hidden />
                <span className="eyebrow">On a rented platform</span>
              </div>
              <p className="mt-5 text-lg text-muted">
                Your website goes dark. Your listing pages, lead forms, neighborhood pages, imported
                reviews, and every bit of SEO history you built — gone with it. You walk away with
                nothing to show for years of payments.
              </p>
            </div>
            <div className="rounded-3xl border border-accent/50 bg-[color:var(--accent-soft)] p-8">
              <div className="flex items-center gap-2 text-accent">
                <KeyRound size={18} aria-hidden />
                <span className="eyebrow">On a site you own</span>
              </div>
              <p className="mt-5 text-lg">
                Nothing changes. Your site, your domain, your leads, your rankings, and your brand are
                still yours — running on hosting you control. Keep our support or not, the asset is
                permanently yours.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* One closing pays for it */}
      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="03">The real estate math</SectionLabel>
          <h2 className="mt-6 max-w-[24ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            One closing pays for a site you own — for life.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                h: "Rent a team site",
                v: "≈ $24,000",
                s: "Placester Broker Standard at $399/mo over five years — and you own nothing at the end.",
              },
              {
                h: "Rent an agent site",
                v: "≈ $7,700",
                s: "Agent Premier at $129/mo over five years. Still a shared template. Still not yours.",
              },
              {
                h: "Own it with Pilk.ai",
                v: "One build",
                s: "From $750 (template) to $2,500+ (custom) — often less than your commission on a single sale.",
              },
            ].map((c, i) => (
              <Reveal key={c.h} delay={i * 70}>
                <div className="h-full rounded-2xl border border-[color:var(--line-on-light)] p-7">
                  <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-on-light-muted)]">
                    {c.h}
                  </div>
                  <div className="mt-3 font-display text-3xl font-semibold">{c.v}</div>
                  <p className="mt-3 text-sm text-[color:var(--text-on-light-muted)]">{c.s}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm text-[color:var(--text-on-light-muted)]">
            One commission check covers a website you own forever. A rented platform keeps charging
            you every month you&apos;re in business — closing or not.
          </p>
        </Container>
      </section>

      {/* What you own */}
      <section className="section relative z-10">
        <Container>
          <SectionLabel index="04">What stays yours</SectionLabel>
          <h2 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            A real asset for your business — not a monthly bill.
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Your website, code, and content — owned outright",
              "Your domain and its built-up local SEO ranking",
              "Your listings, galleries, and neighborhood pages",
              "Your leads and contacts — exportable and portable",
              "A custom design no other agent in your market has",
              "Optional GoHighLevel CRM built to run your pipeline",
            ].map((f) => (
              <div key={f} className="flex gap-3 border-t border-line pt-4 text-sm">
                <Check size={16} className="mt-0.5 flex-none text-accent" aria-hidden />
                <span>{f}</span>
              </div>
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
              Tell us about your real estate business and we&apos;ll show you what a site you own can
              look like.
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
