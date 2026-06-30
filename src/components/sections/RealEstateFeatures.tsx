import {
  Search,
  Images,
  MapPin,
  MousePointerClick,
  Workflow,
  Calculator,
  Star,
  CalendarCheck,
  Sparkles,
  Smartphone,
  KeyRound,
  BadgeCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

const A = "/template-previews/_assets";

const marquee = [
  {
    icon: Search,
    title: "IDX / MLS home search",
    body: "Live listings from your MLS with map search and saved searches — built to capture leads (where your market allows).",
  },
  {
    icon: Images,
    title: "Listing pages that sell the feeling",
    body: "Cinematic property pages with photo galleries, video, and floor plans — even a scroll-through drone experience.",
  },
  {
    icon: MousePointerClick,
    title: "Lead capture everywhere",
    body: "Home-valuation, contact, and saved-search forms turn anonymous visitors into contacts in your pipeline.",
  },
];

const features = [
  {
    icon: MapPin,
    title: "Neighborhood & market guides",
    body: "Area pages that rank for local searches and make you the obvious local expert.",
  },
  {
    icon: Workflow,
    title: "CRM & automated follow-up",
    body: "Optional GoHighLevel build — pipelines, SMS + email nurture, so no lead ever goes cold.",
  },
  {
    icon: BadgeCheck,
    title: "Your personal brand",
    body: "Bio, recent sales, designations, and story — a site that's unmistakably you, not a template clone.",
  },
  {
    icon: Calculator,
    title: "Mortgage & financing tools",
    body: "Payment calculators, rate-style modules, and clean pre-approval / application paths for lenders.",
  },
  {
    icon: Star,
    title: "Reviews & social proof",
    body: "Imported reviews and client stories that build instant trust with new buyers and sellers.",
  },
  {
    icon: CalendarCheck,
    title: "Booking & showings",
    body: "Let buyers schedule a tour or a consult straight from the site — synced to your calendar.",
  },
  {
    icon: Sparkles,
    title: "SEO & AI-search ready",
    body: "Built to get found on Google and in AI search from day one, so the right clients find you.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first by default",
    body: "Most buyers browse on their phone — your site has to feel premium there before anywhere else.",
  },
  {
    icon: KeyRound,
    title: "You own it outright",
    body: "A custom site you own — not a monthly rental that vanishes the day you stop paying.",
  },
];

export function RealEstateFeatures() {
  return (
    <section className="section relative z-10">
      <Container>
        <SectionLabel index="01">Built only for real estate</SectionLabel>
        <h2 className="mt-6 max-w-[22ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
          Everything a real estate site needs to win clients.
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          We build websites for one industry — real estate and mortgage. Every feature below is here
          because it helps agents, teams, and lenders look sharper, rank higher, and capture more
          qualified leads.
        </p>

        {/* Marquee: house image + 3 standout features */}
        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2">
          <Reveal>
            <div
              className="relative h-full min-h-[360px] overflow-hidden rounded-3xl border border-line"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.6)), url('${A}/hero-luxury-exterior.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-x-0 bottom-0 p-7">
                <span className="eyebrow text-white/80">Real estate, done right</span>
                <p className="mt-2 max-w-sm text-lg font-medium text-white">
                  Sites that make your listings — and you — look like the top of the market.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5">
            {marquee.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="flex gap-5 rounded-2xl border border-line bg-surface p-6">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[color:var(--accent-soft)] text-accent">
                    <f.icon size={20} aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-base font-medium">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-muted">{f.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Feature grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 50}>
              <div className="h-full rounded-2xl border border-line bg-surface p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--accent-soft)] text-accent">
                  <f.icon size={20} aria-hidden />
                </div>
                <h3 className="mt-4 text-base font-medium">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
