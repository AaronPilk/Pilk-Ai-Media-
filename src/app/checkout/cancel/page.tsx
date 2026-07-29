import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = buildMetadata({
  title: "Checkout canceled",
  description: "Your checkout was canceled — no charge was made.",
  path: "/checkout/cancel",
});

export default function CheckoutCancelPage() {
  return (
    <section className="section relative z-10 pt-[clamp(8rem,18vh,12rem)]">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow text-accent">Checkout canceled</span>
          <h1 className="mt-4 text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            No charge was made.
          </h1>
          <p className="mt-4 text-muted">
            Your checkout was canceled and your card was not charged. Whenever you&apos;re ready, pick up right
            where you left off.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href="/checkout" variant="primary" withArrow>
              Return to checkout
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
