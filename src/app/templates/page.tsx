import type { Metadata } from "next";
import { buildMetadata, breadcrumbNode, pageGraph } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageIntro } from "@/components/layout/PageIntro";
import { TemplateCatalog } from "@/components/sections/TemplateCatalog";

export const metadata: Metadata = buildMetadata({
  title: "Real Estate & Mortgage Website Templates",
  description:
    "Browse website templates for real estate agents, brokerages, lenders and property managers. Every design is a real, clickable site you can make your own.",
  path: "/templates",
});

export default function TemplatesPage() {
  return (
    <>
      <JsonLd
        data={pageGraph(
          breadcrumbNode([{ name: "Templates", path: "/templates/" }])
        )}
      />
      <PageIntro
        eyebrow="Templates"
        title="Start with a design. Make it yours."
        sub="Premium starting points you can customize, or a fully custom build from zero."
      />
      <TemplateCatalog index="" heading="The catalog." />
    </>
  );
}
