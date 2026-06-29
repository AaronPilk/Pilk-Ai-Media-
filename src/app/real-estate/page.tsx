import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { templates } from "@/content/templates";
import { buildMetadata, faqJsonLd } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { TemplateCard } from "@/components/templates/TemplateCard";
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

const benefits = [
  "Elevated personal brand",
  "Featured-property storytelling",
  "Neighborhood & market pages",
  "Lead forms & CRM connections",
  "Mobile-first browsing",
  "Analytics & tracking",
  "IDX/MLS where available",
  "Fast launch options",
];

export default function RealEstatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <header className="relative z-10 pb-8 pt-[clamp(7rem,18vh,12rem)]">
        <Container>
          <SectionLabel>Real estate & mortgage websites</SectionLabel>
          <h1 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-hero)" }}>
            Your website is the first showing.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted">
            Whether you&apos;re an individual agent who wants a sharp personal site, or a brokerage or
            mortgage firm that needs the full build — we create a digital presence that captures
            qualified leads and gets you remembered.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="#designs" variant="primary" withArrow>
              View real estate designs
            </Button>
            <Button href="#inquire" variant="ghost">
              Request a website
            </Button>
          </div>
        </Container>
      </header>

      <section className="relative z-10 pt-8">
        <Container>
          <SectionLabel>Interactive experience · custom build</SectionLabel>
          <Link
            href="/real-estate/experience/estate"
            className="group relative mt-8 block overflow-hidden rounded-[24px] border border-line"
            style={{
              backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.32), rgba(0,0,0,0.82)), url('/experience/mansion/poster.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative flex min-h-[420px] flex-col justify-end gap-4 p-8 sm:p-14">
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

      <section className="section relative z-10 pt-12">
        <Container>
          <SectionLabel index="01">Built for real estate &amp; mortgage</SectionLabel>
          <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b} delay={i * 50} className="border-t border-line pt-4 text-sm">
                {b}
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

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

      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="04">IDX / MLS</SectionLabel>
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
