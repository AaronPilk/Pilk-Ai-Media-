import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = buildMetadata({
  title: "Checkout — Mortgage Website",
  description:
    "Secure Stripe checkout for your mortgage website: $500 build, 10% fees & processing, optional add-ons. $100/mo hosting starts 30 days later.",
  path: "/checkout",
  noindex: true,
});

export default function CheckoutPage() {
  return (
    <section className="section relative z-10 pt-[clamp(7rem,16vh,10rem)]">
      <Container>
        <Suspense fallback={null}>
          <CheckoutClient />
        </Suspense>
      </Container>
    </section>
  );
}
