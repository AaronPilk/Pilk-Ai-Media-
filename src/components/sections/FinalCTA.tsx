import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA() {
  return (
    <section className="section relative z-10 text-center">
      <Container>
        <Reveal>
          <h2 className="mx-auto max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            {site.finalCta.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-muted">{site.finalCta.sub}</p>
          <div className="mt-10 flex justify-center">
            <Button href="/contact" variant="primary" withArrow data-cursor="open">
              {site.cta.primary.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
