import Link from "next/link";
import type { ExperienceConfig } from "@/content/experiences";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The "rest of the website" that continues below the cinematic drone hero,
 * turning each experience into a full realtor site (listings, firm, agent,
 * neighborhood, contact). Dark luxe theme to match the experience.
 */
export function ExperienceSite({ config }: { config: ExperienceConfig }) {
  const s = config.site;

  return (
    <div className="relative z-10 bg-[#0b0b0e] text-white">
      {/* Listings */}
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

      {/* The firm / agent */}
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
              <SectionLabel>{s.aboutEyebrow}</SectionLabel>
              <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-xl)" }}>
                {s.aboutTitle}
              </h2>
              <p className="mt-5 max-w-md text-white/70">{s.aboutBody}</p>
              <div className="mt-7 border-t border-white/10 pt-5">
                <div className="font-display text-lg font-semibold">{s.agentName}</div>
                <div className="mt-1 text-sm text-white/55">{s.agentTitle}</div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Neighborhood */}
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
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-white/10 py-24 text-center sm:py-32">
        <Container>
          <SectionLabel>{s.brand}</SectionLabel>
          <h2 className="mx-auto mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            {s.contactTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/70">{s.contactBody}</p>
          <Link
            href={config.ctaHref}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            {config.ctaLabel}
          </Link>
          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-white/35">
            A custom build by Pilk.ai
          </p>
        </Container>
      </section>
    </div>
  );
}
