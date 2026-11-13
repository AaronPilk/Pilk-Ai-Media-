import Link from "next/link";
import { Check } from "lucide-react";
import type { Service } from "@/content/services";
import { site } from "@/content/site";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/services/FaqList";
import { RelatedServices } from "@/components/services/RelatedServices";

/** Layout shared by every /services/<slug>/ page. Content lives in src/content/services. */
export function ServicePageView({ service }: { service: Service }) {
  const cta = service.ctaHref ?? "/inquiry/";
  return (
    <>
      <PageIntro
        eyebrow={service.eyebrow}
        title={service.headline}
        sub={service.intro}
        bgImage={service.image}
      />

      <div className="relative z-10">
        <Container className="flex flex-wrap gap-4 pb-4">
          <Button href={cta} variant="primary" withArrow>
            Start a project
          </Button>
          <Button href={site.contact.phoneHref} variant="ghost">
            Call {site.contact.phone}
          </Button>
        </Container>
      </div>

      <section className="section relative z-10">
        <Container className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <SectionLabel index="01">What it is</SectionLabel>
            <div className="mt-6 flex max-w-2xl flex-col gap-5 text-lg text-muted">
              {service.whatItIs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
          <div>
            <SectionLabel index="02">Who it&apos;s for</SectionLabel>
            <ul className="mt-6 flex flex-col gap-4">
              {service.whoFor.map((w) => (
                <li
                  key={w}
                  className="flex gap-3 border-t border-line pt-4 text-sm"
                >
                  <Check
                    size={16}
                    className="mt-0.5 flex-none text-accent"
                    aria-hidden
                  />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="03">How it works</SectionLabel>
          <h2
            className="mt-6 max-w-[20ch] text-balance"
            style={{ fontSize: "var(--text-2xl)" }}
          >
            How an engagement runs.
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {service.steps.map((step, i) => (
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
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <SectionLabel index="04">
              {service.includedHeading ?? "What's included"}
            </SectionLabel>
            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {service.included.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm">
                  <Check
                    size={16}
                    className="mt-0.5 flex-none text-accent"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {service.pricing && (
            <div className="rounded-3xl border border-line bg-surface p-8">
              <span className="eyebrow">Pricing</span>
              <p className="mt-4 text-sm leading-relaxed">{service.pricing}</p>
              <div className="mt-6">
                <Button href={cta} variant="primary" withArrow>
                  Get a quote
                </Button>
              </div>
            </div>
          )}
        </Container>
      </section>

      {service.relatedWork && service.relatedWork.length > 0 && (
        <section className="section relative z-10 pt-0">
          <Container>
            <SectionLabel index="05">Related work</SectionLabel>
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {service.relatedWork.map((work) => (
                <li key={work.href}>
                  <Link
                    href={work.href}
                    className="block h-full rounded-2xl border border-line p-6 transition-colors hover:border-accent"
                  >
                    <span className="text-base font-medium">{work.label}</span>
                    <span className="mt-2 block text-sm text-muted">
                      {work.note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <FaqList items={service.faqs} />

      <RelatedServices
        slugs={service.related}
        className="section relative z-10"
      />

      <section className="section relative z-10 pt-0 text-center">
        <Container>
          <h2
            className="mx-auto max-w-[20ch] text-balance"
            style={{ fontSize: "var(--text-2xl)" }}
          >
            Want to talk it through?
          </h2>
          <p className="mx-auto mt-6 max-w-md text-muted">
            Tell us what you&apos;re trying to fix. Based in{" "}
            {site.entity.locality}, {site.entity.regionName}, working with
            businesses across Tampa Bay.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href={cta} variant="primary" withArrow>
              Start a project
            </Button>
            <Button href={`mailto:${site.contact.email}`} variant="ghost">
              {site.contact.email}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
