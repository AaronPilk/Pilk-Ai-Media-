import type { Metadata } from "next";
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
  title: "Real Estate Website Design",
  description:
    "Website design for real-estate agents, teams, and brokerages. Realtor and luxury real-estate websites built to capture qualified inquiries — with IDX/MLS integration where available.",
  path: "/real-estate",
});

const reCategories = ["agent", "luxury-agent", "brokerage", "mortgage", "title"];
const reTemplates = templates.filter((t) => reCategories.includes(t.category));

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
          <SectionLabel>Websites for agents, teams & brokerages</SectionLabel>
          <h1 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-hero)" }}>
            Your website is the first showing.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted">
            Build a digital presence that reflects the properties you represent, captures qualified
            inquiries, and gives clients a reason to remember your name.
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

      <section className="section relative z-10 pt-8">
        <Container>
          <SectionLabel index="01">Built for real estate</SectionLabel>
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
          <SectionLabel index="02">Real estate designs</SectionLabel>
          <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Starting points for agents, teams, and brokerages.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reTemplates.map((t) => (
              <TemplateCard key={t.slug} template={t} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="03">IDX / MLS</SectionLabel>
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
