import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { InquiryForm } from "@/components/contact/InquiryForm";

export const metadata: Metadata = buildMetadata({
  title: "Inquiry",
  description: "Quick inquiry — leave your details and we'll reach out.",
  path: "/inquiry",
});

export default function InquiryPage() {
  return (
    <>
      <header className="relative z-10 pt-[clamp(7rem,18vh,12rem)]">
        <Container>
          <SectionLabel>Quick inquiry</SectionLabel>
          <h1 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Tell us a little, and we&apos;ll reach out.
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Just the basics to start the conversation. Ready to give us the full picture?{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Start a Project
            </Link>{" "}
            instead.
          </p>
        </Container>
      </header>

      <section className="section relative z-10 pt-10">
        <Container>
          <InquiryForm />
        </Container>
      </section>
    </>
  );
}
