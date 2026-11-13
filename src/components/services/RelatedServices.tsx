import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getServiceCard } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Cross-links between service pages and the pages that sell into them. */
export function RelatedServices({
  slugs,
  heading = "Related services",
  className,
}: {
  slugs: string[];
  heading?: string;
  className?: string;
}) {
  const cards = slugs.map(getServiceCard).filter((c) => c !== undefined);
  if (cards.length === 0) return null;

  return (
    <section
      className={className ?? "section relative z-10 pt-0"}
      aria-label={heading}
    >
      <Container>
        <SectionLabel>{heading}</SectionLabel>
        <ul
          className={`mt-8 grid gap-4 sm:grid-cols-2 ${cards.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
        >
          {cards.map((card) => (
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
                <span className="mt-2 text-sm text-muted">{card.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          <Link href="/services/" className="text-accent hover:underline">
            See all services
          </Link>
        </p>
      </Container>
    </section>
  );
}
