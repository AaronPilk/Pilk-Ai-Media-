import type { Metadata } from "next";
import { buildMetadata, breadcrumbNode, pageGraph } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { OwnVsRent } from "@/components/sections/OwnVsRent";

export const metadata: Metadata = buildMetadata({
  absoluteTitle: "Own Your Website: Pilk.ai vs Placester",
  description:
    "Placester charges $59 to $599 a month for a template site you rent. Pilk.ai builds a custom real estate website you own outright. See the comparison.",
  path: "/own-vs-rent",
});

export default function OwnVsRentPage() {
  return (
    <>
      <JsonLd
        data={pageGraph(
          breadcrumbNode([{ name: "Own vs Rent", path: "/own-vs-rent/" }])
        )}
      />
      <OwnVsRent variant="page" />
    </>
  );
}
