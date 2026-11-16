import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { agencyWorthIt as guide } from "@/content/guides/web-design-agency-worth-it";
import { site } from "@/content/site";
import { stripInline } from "@/lib/inline";
import {
  articleNode,
  breadcrumbNode,
  buildMetadata,
  faqNode,
  pageGraph,
} from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { InlineText } from "@/components/ui/InlineText";

export const metadata: Metadata = buildMetadata({
  title: guide.title,
  description: guide.description,
  path: guide.path,
  article: {
    published: guide.published,
    modified: guide.updated,
    author: guide.author,
  },
});

function formatDate(iso: string) {
  // Noon UTC keeps the calendar day the same in every US time zone.
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const h2Style = { fontSize: "var(--text-xl)" };

/** A centered reading column. Container sets its own max-width after
 *  Tailwind's utilities, so the narrower width goes on an inner wrapper. */
function Column({
  width = "max-w-3xl",
  className = "",
  children,
}: {
  width?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Container>
      <div className={`mx-auto ${width} ${className}`.trim()}>{children}</div>
    </Container>
  );
}

export default function AgencyWorthItPage() {
  return (
    <>
      <JsonLd
        data={pageGraph(
          articleNode({
            path: guide.path,
            headline: guide.headline,
            description: guide.description,
            published: guide.published,
            modified: guide.updated,
          }),
          breadcrumbNode([
            { name: "Services", path: "/services/" },
            { name: "Websites", path: "/services/websites/" },
            { name: "Is a web design agency worth it?", path: guide.path },
          ]),
          // Only the question sections are marked up: each one is a visible
          // H2 with its full answer underneath.
          faqNode(
            guide.sections.map((s) => ({
              q: s.q,
              a: s.answer.map(stripInline).join(" "),
            }))
          )
        )}
      />

      <article>
        <header className="relative z-10 pb-6 pt-[clamp(7rem,18vh,12rem)]">
          <Column>
            <SectionLabel>{guide.eyebrow}</SectionLabel>
            <h1
              className="mt-6 text-balance"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              {guide.headline}
            </h1>
            <p className="mt-6 text-sm text-muted">
              By {guide.author}, {site.entity.name} · Published{" "}
              <time dateTime={guide.published}>
                {formatDate(guide.published)}
              </time>{" "}
              · Updated{" "}
              <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
            </p>

            <div className="border-accent/40 mt-10 rounded-3xl border bg-[color:var(--accent-soft)] p-7 sm:p-8">
              <span className="eyebrow text-accent">The short answer</span>
              <p className="mt-4 text-lg leading-relaxed">
                {guide.shortAnswer.join(" ")}
              </p>
            </div>

            <p className="mt-8 text-lg text-muted">{guide.intro}</p>
          </Column>
        </header>

        <div className="relative z-10">
          <Column>
            {guide.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-t border-line py-10"
              >
                <h2 className="text-balance" style={h2Style}>
                  {section.q}
                </h2>
                <div className="mt-5 flex flex-col gap-4 text-muted">
                  {section.answer.map((p) => (
                    <p key={p.slice(0, 40)}>
                      <InlineText text={p} />
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </Column>
        </div>

        <section className="section env-light relative z-10">
          <Column width="max-w-4xl">
            <h2 className="text-balance" style={h2Style}>
              {guide.comparison.heading}
            </h2>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-[color:var(--line-on-light)]">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="p-4">
                      <span className="sr-only">Question</span>
                    </th>
                    {guide.comparison.columns.map((c) => (
                      <th
                        key={c}
                        scope="col"
                        className="border-l border-[color:var(--line-on-light)] p-4 font-medium"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.comparison.rows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-t border-[color:var(--line-on-light)] align-top"
                    >
                      <th scope="row" className="p-4 font-medium">
                        {row.label}
                      </th>
                      <td className="border-l border-[color:var(--line-on-light)] p-4 text-[color:var(--text-on-light-muted)]">
                        {row.diy}
                      </td>
                      <td className="border-l border-[color:var(--line-on-light)] p-4">
                        {row.us}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-[color:var(--text-on-light-muted)]">
              Our figures are starting prices. Every project gets a written
              quote, and work starts once you approve it and pay the invoice.
            </p>
          </Column>
        </section>

        <section className="section relative z-10">
          <Column
            width="max-w-5xl"
            className="grid gap-12 lg:grid-cols-2 lg:gap-16"
          >
            <div id={guide.notFor.id} className="scroll-mt-28">
              <h2 className="text-balance" style={h2Style}>
                {guide.notFor.heading}
              </h2>
              <ul className="mt-6 flex flex-col gap-4">
                {guide.notFor.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-t border-line pt-4 text-sm"
                  >
                    <X
                      size={16}
                      className="mt-0.5 flex-none text-muted"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-balance" style={h2Style}>
                {guide.worthIt.heading}
              </h2>
              <ul className="mt-6 flex flex-col gap-4">
                {guide.worthIt.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 border-t border-line pt-4 text-sm"
                  >
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
          </Column>
        </section>

        <section className="section env-light relative z-10">
          <Column>
            <h2 className="text-balance" style={h2Style}>
              {guide.checklist.heading}
            </h2>
            <ol className="mt-8 flex list-decimal flex-col gap-3 pl-5 text-[color:var(--text-on-light-muted)]">
              {guide.checklist.items.map((item) => (
                <li key={item} className="pl-1">
                  {item}
                </li>
              ))}
            </ol>
          </Column>
        </section>

        <section className="section relative z-10 text-center">
          <Column>
            <h2 className="mx-auto text-balance" style={h2Style}>
              {guide.cta.heading}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-muted">
              {guide.cta.body} Call{" "}
              <a
                href={site.contact.phoneHref}
                className="text-accent hover:underline"
              >
                {site.contact.phone}
              </a>{" "}
              or email{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-accent hover:underline"
              >
                {site.contact.email}
              </a>
              .
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href="/contact/" variant="primary" withArrow>
                Tell us about your project
              </Button>
              <Button href="/services/websites/" variant="ghost">
                How our website builds work
              </Button>
            </div>
          </Column>
        </section>
      </article>
    </>
  );
}
