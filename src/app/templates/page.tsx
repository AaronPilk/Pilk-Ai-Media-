import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { TemplateCatalog } from "@/components/sections/TemplateCatalog";

export const metadata: Metadata = buildMetadata({
  title: "Website Templates",
  description:
    "Browse premium website templates for real-estate agents, brokerages, mortgage, title, and local business — or commission something completely custom.",
  path: "/templates",
});

export default function TemplatesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Templates"
        title="Start with a design. Make it yours."
        sub="Premium starting points you can customize, or a fully custom build from zero."
      />
      <TemplateCatalog index="" heading="The catalog." />
    </>
  );
}
