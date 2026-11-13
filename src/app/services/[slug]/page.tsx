import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicePages, getServicePage } from "@/content/services";
import {
  buildMetadata,
  breadcrumbNode,
  faqNode,
  pageGraph,
  serviceNode,
} from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServicePageView } from "@/components/services/ServicePageView";

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) return buildMetadata({ title: "Services", path: "/services/" });
  return buildMetadata({
    title: service.title,
    description: service.description,
    path: service.href,
    image: service.image,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={pageGraph(
          serviceNode({ ...service, description: service.description }),
          breadcrumbNode([
            { name: "Services", path: "/services/" },
            { name: service.name, path: service.href },
          ]),
          faqNode(service.faqs)
        )}
      />
      <ServicePageView service={service} />
    </>
  );
}
