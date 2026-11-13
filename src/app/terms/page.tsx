import type { Metadata } from "next";
import { buildMetadata, breadcrumbNode, pageGraph } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { termsOfService } from "@/content/legal/terms";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Terms for pilk.ai and Pilk.ai services: orders, payments, monthly plans, refunds, website ownership, AI services and how disputes are resolved.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd data={pageGraph(breadcrumbNode([{ name: "Terms of Service", path: "/terms/" }]))} />
      <PageIntro eyebrow="Legal" title={termsOfService.title} />
      <section className="relative z-10 pb-24 pt-2 sm:pb-32">
        <Container>
          <article className="legal-surface -mx-3 max-w-3xl rounded-md px-3 py-6 sm:mx-0 sm:px-8 sm:py-8">
            <LegalDocumentView doc={termsOfService} />
          </article>
        </Container>
      </section>
    </>
  );
}
