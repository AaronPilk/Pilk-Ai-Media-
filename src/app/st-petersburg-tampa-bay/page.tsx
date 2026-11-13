import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { local } from "@/content/local";
import { serviceCatalog } from "@/content/services";
import { site } from "@/content/site";
import {
  buildMetadata,
  breadcrumbNode,
  faqNode,
  pageGraph,
} from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/services/FaqList";

export const metadata: Metadata = buildMetadata({
  title: local.title,
  description: local.description,
  path: local.path,
});

export default function LocalPage() {
  return (
    <>
      <JsonLd
        data={pageGraph(
          breadcrumbNode([
            { name: "St. Petersburg & Tampa Bay", path: local.path },
          ]),
          faqNode(local.faqs)
        )}
      />
      <PageIntro
        eyebrow={local.eyebrow}
        title={local.headline}
        sub={local.intro}
        bgImage="/brand/brand-light.jpg"
      />

      <div className="relative z-10">
        <Container className="flex flex-wrap gap-4 pb-4">
          <Button href={site.contact.phoneHref} variant="primary" withArrow>
            Call {site.contact.phone}
          </Button>
          <Button href="/inquiry/" variant="ghost">
            Send a quick inquiry
          </Button>
        </Container>
      </div>

      <section className="section relative z-10">
        <Container>
          <SectionLabel index="01">Why work with us</SectionLabel>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {local.why.map((item) => (
              <div key={item.title} className="border-t border-line pt-6">
                <h2 className="text-xl font-medium">{item.title}</h2>
                <p className="mt-3 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="02">What we do here</SectionLabel>
          <h2
            className="mt-6 max-w-[22ch] text-balance"
            style={{ fontSize: "var(--text-2xl)" }}
          >
            Services for St. Petersburg and Tampa Bay businesses.
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCatalog.map((card) => (
              <li key={card.slug}>
                <Link
                  href={card.href}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent"
                >
                  <span className="flex items-center justify-between gap-3 text-base font-medium">
                    {card.name}
                    <ArrowUpRight
                      size={16}
                      aria-hidden
                      className="flex-none text-muted transition-colors group-hover:text-accent"
                    />
                  </span>
                  <span className="mt-2 text-sm text-muted">
                    {card.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section relative z-10">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionLabel index="03">Local work</SectionLabel>
            <Link
              href={local.localWork.href}
              className="mt-8 block rounded-3xl border border-line bg-surface p-8 transition-colors hover:border-accent"
            >
              <span className="text-2xl font-medium">
                {local.localWork.label}
              </span>
              <span className="mt-3 block text-muted">
                {local.localWork.note}
              </span>
              <span className="mt-6 inline-flex items-center gap-1 text-sm text-accent">
                View the project <ArrowUpRight size={14} aria-hidden />
              </span>
            </Link>
            <p className="mt-6 text-sm text-muted">
              More websites, apps and builds are on{" "}
              <Link href="/work/" className="text-accent hover:underline">
                our work page
              </Link>
              .
            </p>
          </div>
          <div>
            <SectionLabel index="04">Where we work</SectionLabel>
            <p className="mt-8 text-lg text-muted">{local.areas}</p>
            <dl className="mt-8 grid gap-4 text-sm">
              <div className="flex gap-3">
                <dt className="w-20 flex-none text-muted">Phone</dt>
                <dd>
                  <a
                    href={site.contact.phoneHref}
                    className="hover:text-accent"
                  >
                    {site.contact.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 flex-none text-muted">Email</dt>
                <dd>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="hover:text-accent"
                  >
                    {site.contact.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 flex-none text-muted">Based in</dt>
                <dd>
                  {site.entity.locality}, {site.entity.regionName}
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <FaqList items={local.faqs} index="05" />

      <section className="section relative z-10 text-center">
        <Container>
          <h2
            className="mx-auto max-w-[20ch] text-balance"
            style={{ fontSize: "var(--text-2xl)" }}
          >
            Have a project in Tampa Bay?
          </h2>
          <p className="mx-auto mt-6 max-w-md text-muted">
            Tell us what you need. A website, an app, AI automation, or help
            bringing in leads.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/contact/" variant="primary" withArrow>
              Start a project
            </Button>
            <Button href="/services/" variant="ghost">
              All services
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
