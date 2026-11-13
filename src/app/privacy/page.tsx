import type { Metadata } from "next";
import { site } from "@/content/site";
import { buildMetadata, breadcrumbNode, pageGraph } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Pilk.ai, operated by Pilk Consulting LLC, collects and uses the information you share through pilk.ai inquiry and project forms.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={pageGraph(breadcrumbNode([{ name: "Privacy Policy", path: "/privacy/" }]))} />
      <PageIntro eyebrow="Legal" title="Privacy Policy" />
      <section className="section relative z-10 pt-4">
        <Container as="article" className="max-w-2xl text-sm leading-relaxed text-muted">
          <p className="rounded-sm border border-line bg-surface p-4">
            Placeholder policy — replace with your reviewed legal copy before launch.
          </p>
          <h2 className="mt-10 text-lg font-medium text-ink">Information we collect</h2>
          <p className="mt-2">
            When you submit an inquiry, we collect the details you provide (name, contact
            information, and project details) and basic campaign attribution to understand how you
            found us.
          </p>
          <h2 className="mt-8 text-lg font-medium text-ink">How we use it</h2>
          <p className="mt-2">
            We use your information to respond to your inquiry and provide our services. We do not
            sell your personal information.
          </p>
          <h2 className="mt-8 text-lg font-medium text-ink">Analytics</h2>
          <p className="mt-2">
            We may use privacy-respecting analytics to improve the site. You can control cookies
            through your browser settings.
          </p>
          <h2 className="mt-8 text-lg font-medium text-ink">Contact</h2>
          <p className="mt-2">
            Questions about privacy? Email{" "}
            <a href={`mailto:${site.contact.email}`} className="text-accent">
              {site.contact.email}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
