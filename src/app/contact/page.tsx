import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Start a Project",
  description:
    "Tell us about your business and what you need. Start with a template or commission a fully custom website.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="relative z-10 pb-24 pt-[clamp(7rem,18vh,12rem)]">
      <Container className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionLabel>Contact</SectionLabel>
          <h1 className="mt-6 max-w-[14ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            {site.finalCta.headline}
          </h1>
          <p className="mt-6 max-w-sm text-muted">{site.finalCta.sub}</p>

          <div className="mt-10 flex flex-col gap-3 text-sm">
            <a href={`mailto:${site.contact.email}`} className="text-muted hover:text-ink">
              {site.contact.email}
            </a>
            <a href={site.contact.phoneHref} className="text-muted hover:text-ink">
              {site.contact.phone}
            </a>
            <span className="text-muted">{site.location}</span>
          </div>
        </div>

        <div>
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
