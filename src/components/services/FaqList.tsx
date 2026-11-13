import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Questions and answers rendered open, not in an accordion: every answer is
 * readable without a click, and the visible text matches the FAQPage markup.
 */
export function FaqList({
  items,
  index,
  heading = "Questions, answered.",
}: {
  items: { q: string; a: string }[];
  index?: string;
  heading?: string;
}) {
  return (
    <section className="section env-light relative z-10" id="faq">
      <Container>
        <SectionLabel index={index}>FAQ</SectionLabel>
        <h2
          className="mt-6 max-w-[18ch] text-balance"
          style={{ fontSize: "var(--text-2xl)" }}
        >
          {heading}
        </h2>
        <dl className="mx-auto mt-12 max-w-3xl border-t border-line">
          {items.map((item) => (
            <div key={item.q} className="border-b border-line py-6">
              <dt className="text-lg font-medium">{item.q}</dt>
              <dd className="mt-2 text-sm text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
