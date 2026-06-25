import type { Metadata } from "next";
import { features } from "@/lib/features";
import { buildMetadata } from "@/lib/metadata";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = buildMetadata({
  title: "Lab",
  description: "An experimental interactive corner of Pilk.ai Media.",
  path: "/lab",
});

export default function LabPage() {
  return (
    <>
      <PageIntro
        eyebrow="Lab"
        title="Build your first impression."
        sub="An experimental, game-like way to feel how a site comes together. Drag components into a browser and watch it organize itself."
      />
      <section className="section relative z-10 pt-4">
        <Container>
          {features.interactiveLab ? (
            <div className="rounded-md border border-line bg-surface p-10 text-muted">
              {/* Interactive Lab mounts here when the feature flag is enabled. */}
              Lab experience loading…
            </div>
          ) : (
            <div className="rounded-md border border-line bg-surface p-10">
              <p className="text-muted">
                The interactive Lab is in development. It&apos;s intentionally separate from the
                main flow so it never gets in the way of finding work, pricing, or starting a
                project.
              </p>
              <div className="mt-8">
                <Button href="/contact" variant="primary" withArrow>
                  Build my real website
                </Button>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
