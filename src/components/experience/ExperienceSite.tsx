import Link from "next/link";
import type { ExperienceConfig } from "@/content/experiences";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ExperienceGallery } from "@/components/experience/ExperienceGallery";
import { ShowingBooker } from "@/components/experience/ShowingBooker";

const A = "/template-previews/_assets";

/**
 * The "rest of the website" that continues below the cinematic drone hero,
 * turning each experience into a full single-property luxury listing site:
 * overview, listings, gallery, features, floor plans, story, agent, firm,
 * neighborhood, testimonials, financing, and a private-showing inquiry form.
 * Dark luxe theme to match the experience.
 */
export function ExperienceSite({ config }: { config: ExperienceConfig }) {
  const s = config.site;

  const keyFacts = [
    { v: "$24.5M", l: "Offered at" },
    { v: "6", l: "Bedrooms" },
    { v: "8", l: "Bathrooms" },
    { v: "11,400", l: "Sq Ft" },
    { v: "0.9", l: "Acres" },
    { v: "2023", l: "Year built" },
    { v: "210'", l: "Water frontage" },
    { v: "5", l: "Car garage" },
  ];

  const gallery = [
    { img: `${A}/hero-open-living.jpg`, caption: "Great Room" },
    { img: `${A}/kitchen.jpg`, caption: "Chef's Kitchen" },
    { img: `${A}/bedroom.jpg`, caption: "Primary Suite" },
    { img: `${A}/pool-backyard.jpg`, caption: "Infinity Pool" },
    { img: `${A}/home-theater.jpg`, caption: "Home Theater" },
    { img: `${A}/dining-wine.jpg`, caption: "Wine Room" },
    { img: `${A}/bathroom.jpg`, caption: "Spa & Wellness" },
    { img: `${A}/hero-waterfront.jpg`, caption: "Waterfront" },
  ];

  const interiorFeatures = [
    "Floor-to-ceiling glass walls with disappearing pocket doors",
    "Wide-plank European white oak flooring throughout",
    "Chef's kitchen with dual islands and Gaggenau appliances",
    "Honed Calacatta marble and book-matched stone slabs",
    "Primary suite with private terrace, dual baths, and dressing rooms",
    "Glass-enclosed wine cellar for 1,200+ bottles",
    "Dolby Atmos home theater with tiered seating",
  ];

  const exteriorFeatures = [
    "210 feet of private water frontage with deep-water dock",
    "70-foot vanishing-edge infinity pool and sunken spa",
    "Outdoor kitchen, fire lounge, and covered dining loggia",
    "Mature landscaped grounds with specimen olive trees",
    "Rooftop terrace with 180° open-water and skyline views",
    "Gated motor court with five-car climate-controlled garage",
    "Resort-grade pool cabana with full bath and bar",
  ];

  const systemsFeatures = [
    "Whole-home Crestron automation and lighting control",
    "Lutron motorized shades on every opening",
    "Climate zoning with hospital-grade air filtration",
    "Solar array with whole-home battery backup",
    "24/7 monitored security with perimeter cameras",
    "EV charging and future-ready low-voltage infrastructure",
    "Backup generator sized for full-property continuity",
  ];

  const levels = [
    {
      name: "Lower Level",
      stat: "3,200 SF",
      body: "Theater, wellness spa, glass wine room, gym, and staff quarters — the private retreat beneath the residence.",
    },
    {
      name: "Main Level",
      stat: "5,100 SF",
      body: "Great room, chef's kitchen, formal and casual dining, study, and seamless flow to the pool deck and water.",
    },
    {
      name: "Upper Level",
      stat: "3,100 SF",
      body: "Primary wing with dual baths and terrace, three en-suite bedrooms, and a rooftop lounge above the bay.",
    },
  ];

  const testimonials = [
    {
      quote:
        "They sold the feeling of the home before anyone walked through the door. We closed above ask in eleven days.",
      name: "Jonathan & Mara Cole",
      meta: "Sold — Bayshore Terrace",
    },
    {
      quote:
        "Discreet, precise, and relentless. The level of presentation was unlike anything we'd seen at this price point.",
      name: "Daniel Whitmore",
      meta: "Buyer — Waterfront Estate",
    },
    {
      quote:
        "Every detail was handled before we thought to ask. This is what representation is supposed to feel like.",
      name: "Sofia Marchetti",
      meta: "Seller — The Glass House",
    },
  ];

  return (
    <div className="relative z-10 bg-[#0b0b0e] text-white">
      {/* 1. Property overview */}
      <section className="border-t border-white/10 py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionLabel>20 Bayshore Terrace</SectionLabel>
            <h2 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
              A one-of-one waterfront estate, presented privately.
            </h2>
            <p className="mt-5 max-w-2xl text-white/70">
              Set behind private gates on nearly an acre of open water, this architectural
              statement pairs museum-grade craftsmanship with effortless indoor-outdoor living.
              Floor-to-ceiling glass dissolves the line between the great room and the bay, while
              210 feet of private frontage and a vanishing-edge pool make the water the center of
              every view. Offered turnkey, furnished by appointment.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-4">
            {keyFacts.map((f, i) => (
              <Reveal key={f.l} delay={i * 50}>
                <div>
                  <div className="font-display text-2xl font-semibold sm:text-3xl">{f.v}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">{f.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Featured listings */}
      <section className="border-t border-white/10 py-20 sm:py-28">
        <Container>
          <SectionLabel>{s.listingsEyebrow}</SectionLabel>
          <h2 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            {s.listingsTitle}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {s.listings.map((l, i) => (
              <Reveal key={l.title} delay={i * 70}>
                <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <div className="aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={l.img}
                      alt={l.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="font-display text-xl font-semibold">{l.price}</div>
                    <div className="mt-1 text-sm text-white/80">{l.title}</div>
                    <div className="mt-2 text-xs uppercase tracking-wider text-white/50">{l.meta}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Photo gallery */}
      <section className="border-t border-white/10 py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>The residence</SectionLabel>
              <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
                Inside 20 Bayshore Terrace.
              </h2>
            </div>
            <Link
              href={config.ctaHref}
              className="text-xs uppercase tracking-[0.2em] text-white/55 underline-offset-4 transition-colors hover:text-white"
            >
              View all photos →
            </Link>
          </div>
          <ExperienceGallery gallery={gallery} />
        </Container>
      </section>

      {/* 4. Features & finishes */}
      <section className="border-t border-white/10 py-20 sm:py-28">
        <Container>
          <SectionLabel>Features &amp; finishes</SectionLabel>
          <h2 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Built to a standard you can feel.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              { title: "Interior", items: interiorFeatures },
              { title: "Exterior & grounds", items: exteriorFeatures },
              { title: "Smart home & systems", items: systemsFeatures },
            ].map((col, ci) => (
              <Reveal key={col.title} delay={ci * 80}>
                <div className="border-t border-white/10 pt-6">
                  <h3 className="font-display text-lg font-semibold">{col.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {col.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-white/70">
                        <span className="mt-2 h-1 w-1 flex-none rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Floor plans */}
      <section className="border-t border-white/10 py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionLabel>Floor plans</SectionLabel>
              <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
                Three levels, one continuous experience.
              </h2>
              <p className="mt-5 max-w-md text-white/70">
                Every floor was designed around the water — from the spa and theater below to the
                rooftop lounge above. Complete architectural drawings are available to qualified
                buyers upon request.
              </p>
              <div className="mt-8 space-y-6">
                {levels.map((lv) => (
                  <div key={lv.name} className="flex items-start justify-between gap-6 border-t border-white/10 pt-5">
                    <div>
                      <div className="font-display text-lg font-semibold">{lv.name}</div>
                      <p className="mt-1 max-w-sm text-sm text-white/60">{lv.body}</p>
                    </div>
                    <div className="flex-none text-right text-sm font-medium uppercase tracking-[0.15em] text-white/50">
                      {lv.stat}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${A}/ext-glass-home.jpg`}
                  alt="Residence layout"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 6. The residence story */}
      <section className="border-t border-white/10 py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <SectionLabel>The story</SectionLabel>
              <h2 className="mt-6 text-balance" style={{ fontSize: "var(--text-2xl)" }}>
                A home conceived for one purpose — to live on the water.
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-white/70">
                <p>
                  Three years in the making, 20 Bayshore Terrace began as a single idea: erase the
                  wall between the house and the bay. The result is a residence where morning light
                  moves across honed stone, where the pool seems to spill into open water, and where
                  every principal room opens to the horizon.
                </p>
                <p>
                  Materials were chosen for how they age — European oak that warms with time,
                  book-matched marble cut from a single block, bronze and glass detailing that
                  catches the late sun. Nothing here is loud. Everything is considered.
                </p>
                <p>
                  It is, in the truest sense, a one-of-one — a property that does not come to market
                  twice, presented quietly to those who already know what they are looking for.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 7. The agent */}
      <section className="border-t border-white/10 py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.agentImg} alt={s.agentName} className="aspect-[4/3] w-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <SectionLabel>Your agent</SectionLabel>
              <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-xl)" }}>
                {s.agentName}
              </h2>
              <p className="mt-5 max-w-md text-white/70">
                {s.agentName} represents a select few of the market&apos;s most significant homes.
                Known for discretion and an obsessive command of presentation, she guides each client
                personally — from the first private showing through closing — with a network that
                reaches the buyers others can&apos;t.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
                {[
                  { v: "$1.2B+", l: "Career sales" },
                  { v: "18 yrs", l: "Luxury market" },
                  { v: "Top 1%", l: "Nationally" },
                ].map((stat) => (
                  <div key={stat.l}>
                    <div className="font-display text-xl font-semibold">{stat.v}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.15em] text-white/45">
                      {stat.l}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 border-t border-white/10 pt-5">
                <div className="font-display text-lg font-semibold">{s.agentName}</div>
                <div className="mt-1 text-sm text-white/55">{s.agentTitle}</div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 8. The firm */}
      <section className="border-t border-white/10 py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <SectionLabel>{s.aboutEyebrow}</SectionLabel>
              <h2 className="mx-auto mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
                {s.aboutTitle}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-white/70">{s.aboutBody}</p>
              <p className="mx-auto mt-6 max-w-xl text-white/55">{s.tagline}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 9. Neighborhood */}
      <section
        className="relative border-t border-white/10 py-28 sm:py-36"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(11,11,14,0.55), rgba(11,11,14,0.85)), url('${s.neighborhoodImg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container>
          <SectionLabel>The location</SectionLabel>
          <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            {s.neighborhoodTitle}
          </h2>
          <p className="mt-5 max-w-lg text-white/80">{s.neighborhoodBody}</p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { v: "6 min", l: "To the marina & yacht club" },
              { v: "12 min", l: "To downtown dining & galleries" },
              { v: "25 min", l: "To private aviation terminal" },
            ].map((h, i) => (
              <Reveal key={h.l} delay={i * 70}>
                <div className="border-t border-white/15 pt-5">
                  <div className="font-display text-2xl font-semibold">{h.v}</div>
                  <div className="mt-1 text-sm text-white/70">{h.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 10. Testimonials */}
      <section className="border-t border-white/10 py-20 sm:py-28">
        <Container>
          <SectionLabel>Clients</SectionLabel>
          <h2 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            The standard our clients return for.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                  <blockquote className="flex-1 text-white/80">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-6 border-t border-white/10 pt-5">
                    <div className="font-display text-base font-semibold">{t.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.15em] text-white/45">
                      {t.meta}
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 11. Financing */}
      <section className="border-t border-white/10 py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center sm:p-14">
            <Reveal>
              <SectionLabel>Financing</SectionLabel>
              <h2 className="mx-auto mt-6 text-balance" style={{ fontSize: "var(--text-xl)" }}>
                Estimated from $112,400/mo.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-white/65">
                Illustrative only — based on a 30-year jumbo at 6.25% with 30% down, taxes and
                insurance excluded. Our private-banking partners structure bespoke financing for
                qualified buyers, including portfolio and interest-only options.
              </p>
              <Link
                href={config.ctaHref}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4 transition-opacity hover:opacity-80"
              >
                Speak with our financing desk →
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 12. Inquiry */}
      <section className="border-t border-white/10 py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionLabel>{s.brand}</SectionLabel>
              <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
                {s.contactTitle}
              </h2>
              <p className="mt-5 max-w-md text-white/70">{s.contactBody}</p>
              <div className="mt-8 space-y-2 text-sm text-white/55">
                <div>By private appointment only.</div>
                <div>Qualified buyers and representing agents welcome.</div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <ShowingBooker ctaLabel={config.ctaLabel} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 13. Footer note */}
      <section className="border-t border-white/10 py-12 text-center">
        <Container>
          <p className="text-xs uppercase tracking-[0.25em] text-white/35">
            A custom build by Pilk.ai
          </p>
        </Container>
      </section>
    </div>
  );
}
