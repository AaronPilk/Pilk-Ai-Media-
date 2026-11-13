import type { Metadata } from "next";
import { buildMetadata, breadcrumbNode, pageGraph } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { privacyPolicy } from "@/content/legal/privacy";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Pilk.ai (Pilk Consulting LLC) collects, uses and protects personal information from pilk.ai forms, orders and services, and how to use your rights.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={pageGraph(breadcrumbNode([{ name: "Privacy Policy", path: "/privacy/" }]))} />
      <PageIntro eyebrow="Legal" title={privacyPolicy.title} />
      <section className="relative z-10 pb-24 pt-2 sm:pb-32">
        <Container>
          <article className="legal-surface -mx-3 max-w-3xl rounded-md px-3 py-6 sm:mx-0 sm:px-8 sm:py-8">
            <LegalDocumentView doc={privacyPolicy} />
          </article>
        </Container>
      </section>
    </>
  );
}
