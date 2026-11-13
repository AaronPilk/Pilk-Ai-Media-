import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CHECKOUT } from "@/lib/checkout-pricing";
import { site } from "@/content/site";

export const metadata: Metadata = buildMetadata({
  title: "Payment received",
  description: "Your mortgage website order is confirmed.",
  path: "/checkout/success",
  noindex: true,
});

export default function CheckoutSuccessPage() {
  return (
    <section className="section relative z-10 pt-[clamp(8rem,18vh,12rem)]">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow text-accent">Payment received</span>
          <h1 className="mt-4 text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            You&apos;re in. Let&apos;s build your site.
          </h1>
          <p className="mt-4 text-muted">
            Thank you — your payment went through and your order is confirmed. We&apos;ll reach out shortly to
            kick off your build.
          </p>
          <p className="mt-4 text-sm text-muted">
            Your ${CHECKOUT.monthly}/month hosting plan has started. The first ${CHECKOUT.monthly} charge is{" "}
            {CHECKOUT.monthlyTrialDays} days after today, then it renews every month until you cancel. To cancel,
            email{" "}
            <a href={`mailto:${site.contact.email}`} className="underline underline-offset-2 hover:text-ink">
              {site.contact.email}
            </a>{" "}
            or call {site.contact.phone} any time.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/mortgage" variant="ghost">
              Back to mortgage websites
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
