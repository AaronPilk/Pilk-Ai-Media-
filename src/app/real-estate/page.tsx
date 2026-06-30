import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { templates } from "@/content/templates";
import { buildMetadata, faqJsonLd } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { RealEstateFeatures } from "@/components/sections/RealEstateFeatures";
import { OwnVsRent } from "@/components/sections/OwnVsRent";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { FAQ } from "@/components/sections/FAQ";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Real Estate & Mortgage Website Design",
  description:
    "Websites for individual real-estate agents, brokerages, and mortgage firms. Personal agent sites and full firm sites built to capture qualified leads — with IDX/MLS integration where available.",
  path: "/real-estate",
});

const individualCats = ["agent", "luxury-agent"];
const firmCats = ["brokerage", "mortgage", "local-business"];
const individualTemplates = templates.filter((t) => individualCats.includes(t.category));
const firmTemplates = templates.filter((t) => firmCats.includes(t.category));

export default function RealEstatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <header
        className="relative z-10 flex min-h-[88vh] items-end overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(8,8,11,0.55) 0%, rgba(8,8,11,0.38) 38%, rgba(8,8,11,0.92) 100%), url('/template-previews/_assets/hero-estate.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container>
          <div className="pb-16 pt-[clamp(8rem,20vh,13rem)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              Real estate &amp; mortgage websites — it&apos;s all we build here
            </span>
            <h1
              className="mt-6 max-w-[15ch] text-balance text-white"
              style={{ fontSize: "var(--text-hero)" }}
            >
              Your website is the first showing.
            </h1>
            <p className="mt-7 max-w-2xl text-lg text-white/85">
              Pilk.ai builds websites for one industry: real estate. Whether you&apos;re an agent who
              wants a sharp personal site, or a brokerage or mortgage firm that needs the full build —
              we create a digital presence that captures qualified leads and gets you remembered.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="#designs" variant="primary" withArrow>
                View real estate designs
              </Button>
              <Button href="#inquire" variant="ghost">
                Request a website
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <RealEstateFeatures />

      <section id="designs" className="section relative z-10 pt-8">
        <Container>
          <SectionLabel index="02">For individual agents</SectionLabel>
          <h2 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            A personal site that showcases you.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            For the agent who just wants a clean, professional site — your brand, your listings, and
            how to reach you. Simple or luxury.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {individualTemplates.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </div>
        </Container>
      </section>

      <section id="firms" className="section relative z-10 pt-8">
        <Container>
          <SectionLabel index="03">For firms &amp; brokerages</SectionLabel>
          <h2 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Sites for real estate firms &amp; mortgage brokerages.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Multiple agents, team rosters, loan programs, recruiting, and lead routing — built for
            brokerages and mortgage firms that run a team.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {firmTemplates.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section relative z-10 pt-4">
        <Container>
          <SectionLabel index="04">Interactive experience · custom build</SectionLabel>
          <Link
            href="/real-estate/experience/estate"
            className="group relative mt-8 block overflow-hidden rounded-[24px] border border-line"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0.85)), url('/experience/mansion-v4/poster.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative flex min-h-[460px] flex-col justify-end gap-4 p-8 sm:p-14">
              <span className="eyebrow text-white/80">Interactive listing experience</span>
              <h2 className="max-w-[20ch] text-balance text-white" style={{ fontSize: "var(--text-2xl)" }}>
                Fly through the property as you scroll.
              </h2>
              <p className="max-w-xl text-white/80">
                A fully custom, scroll-driven listing site built from a single continuous drone
                shot — buyers fly through the home as the property, agent, and firm details reveal.
                The top tier of what we build.
              </p>
              <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-transform group-hover:-translate-y-0.5">
                Open the full site ↗
              </span>
            </div>
          </Link>
        </Container>
      </section>

      <OwnVsRent />

      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="06">IDX / MLS</SectionLabel>
          <h2 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-xl)" }}>
            Yes, we can connect listings — but it depends on your market.
          </h2>
          <p className="mt-6 max-w-2xl text-[color:var(--text-on-light-muted)]">
            IDX/MLS availability varies by vendor, your brokerage&apos;s approval, local MLS policies,
            data access, and account credentials. We&apos;ll confirm exactly what&apos;s possible for
            your area before committing to a build — no vague promises.
          </p>
        </Container>
      </section>

      <Pricing />
      <Process />
      <FAQ />

      <section id="inquire" className="section relative z-10">
        <Container>
          <SectionLabel index="09">Request a website</SectionLabel>
          <h2 className="mb-10 mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Let&apos;s build the website your listings deserve.
          </h2>
          <div className="max-w-2xl">
            <Suspense fallback={null}>
              <ContactForm realEstate />
            </Suspense>
          </div>
        </Container>
      </section>
    </>
  );
}
