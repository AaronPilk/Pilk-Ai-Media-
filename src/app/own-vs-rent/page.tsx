import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { OwnVsRent } from "@/components/sections/OwnVsRent";

export const metadata: Metadata = buildMetadata({
  title: "Own Your Website — Pilk.ai vs Placester",
  description:
    "Subscription website builders like Placester rent you a shared template for $59–$599/month, forever. Pilk.ai builds you a custom real-estate website you own outright. See the comparison.",
  path: "/own-vs-rent",
});

export default function OwnVsRentPage() {
  return <OwnVsRent variant="page" />;
}
