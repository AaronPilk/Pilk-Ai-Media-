import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms for using the Pilk.ai Media website and services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageIntro eyebrow="Legal" title="Terms of Service" />
      <section className="section relative z-10 pt-4">
        <Container as="article" className="max-w-2xl text-sm leading-relaxed text-muted">
          <p className="rounded-sm border border-line bg-surface p-4">
            Placeholder terms — replace with your reviewed legal copy before launch.
          </p>
          <h2 className="mt-10 text-lg font-medium text-ink">Use of this site</h2>
          <p className="mt-2">
            This website is provided for information about our services. Pricing shown is a starting
            point; final pricing depends on scope.
          </p>
          <h2 className="mt-8 text-lg font-medium text-ink">Projects</h2>
          <p className="mt-2">
            Project terms, deliverables, timelines, and payment are defined in a separate written
            agreement for each engagement.
          </p>
          <h2 className="mt-8 text-lg font-medium text-ink">Intellectual property</h2>
          <p className="mt-2">
            Designs and content on this site are owned by Pilk.ai Media unless otherwise noted.
          </p>
        </Container>
      </section>
    </>
  );
}
