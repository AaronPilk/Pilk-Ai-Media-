import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { serviceCatalog } from "@/content/services";
import { site } from "@/content/site";
import {
  buildMetadata,
  breadcrumbNode,
  itemListNode,
  pageGraph,
} from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = buildMetadata({
  title: "Services: AI, Apps, Websites & Marketing",
  description:
    "Websites, custom apps, AI consulting, AI automation and chatbots, Meta ads, social media automation, lead funnels and Skool growth from Pilk.ai.",
  path: "/services/",
});

const howWeWork = [
  {
    title: "Talk it through",
    body: "A conversation about your business and what you want to fix. If we're not the right fit, we'll tell you.",
  },
  {
    title: "Written scope",
    body: "What we'll build, what it costs and what you need to provide, agreed before any work starts.",
  },
  {
    title: "Build",
    body: "Focused build cycles with previews along the way, set up in accounts you own.",
  },
  {
    title: "Launch and support",
    body: "We launch, hand over what you need to run it, and stay available for changes after.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={pageGraph(
          breadcrumbNode([{ name: "Services", path: "/services/" }]),
          itemListNode(serviceCatalog)
        )}
      />
      <PageIntro
        eyebrow="Services"
        title="What Pilk.ai builds and runs for you."
        sub="Websites and apps, AI that takes work off your plate, and the marketing that brings people in. Pick one, or put a few together."
        bgImage="/brand/brand-network.jpg"
      />

      <section className="section relative z-10 pt-8">
        <Container>
          <ul className="grid gap-5 md:grid-cols-2">
            {serviceCatalog.map((card, i) => (
              <li key={card.slug}>
                <Link
                  href={card.href}
                  className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-8 transition-colors hover:border-accent"
                >
                  <span className="font-display text-sm font-semibold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-medium">{card.name}</h2>
                    <ArrowUpRight
                      size={20}
                      aria-hidden
                      className="flex-none text-muted transition-colors group-hover:text-accent"
                    />
                  </div>
                  <p className="mt-3 text-muted">{card.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel>How we work</SectionLabel>
          <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {howWeWork.map((step, i) => (
              <li key={step.title}>
                <span className="font-display text-3xl font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="section relative z-10">
        <Container className="max-w-3xl">
          <SectionLabel>Local</SectionLabel>
          <h2
            className="mt-6 text-balance"
            style={{ fontSize: "var(--text-2xl)" }}
          >
            Based in {site.entity.locality}, {site.entity.regionName}.
          </h2>
          <p className="mt-6 text-lg text-muted">
            Pilk.ai works with businesses across St. Petersburg and Tampa Bay.{" "}
            <Link
              href="/st-petersburg-tampa-bay/"
              className="text-accent hover:underline"
            >
              See what we do for local businesses
            </Link>
            , or call{" "}
            <a
              href={site.contact.phoneHref}
              className="text-accent hover:underline"
            >
              {site.contact.phone}
            </a>
            .
          </p>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
