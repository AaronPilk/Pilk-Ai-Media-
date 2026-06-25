"use client";

import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SplitText } from "@/components/ui/SplitText";
import { trackEvent } from "@/lib/analytics";

export function Hero() {
  return (
    <section className="relative z-10 flex min-h-[100svh] items-end pb-[12vh] pt-[28vh]">
      <Container>
        <p className="eyebrow reveal-on-load mb-6">{site.hero.eyebrow}</p>

        <h1 className="max-w-[14ch] text-balance" style={{ fontSize: "var(--text-hero)" }}>
          <SplitText text={site.hero.headline} as="span" />
        </h1>

        <p className="mt-8 max-w-xl text-lg text-muted">{site.hero.sub}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton>
            <Button
              href={site.cta.primaryHomeHref}
              variant="primary"
              withArrow
              data-cursor="view"
              onClick={() => trackEvent("hero_primary_cta_clicked")}
            >
              {site.cta.primaryHomeLabel}
            </Button>
          </MagneticButton>

          <Button
            href={site.cta.secondaryHomeHref}
            variant="ghost"
            data-cursor="open"
            onClick={() => trackEvent("hero_secondary_cta_clicked")}
          >
            {site.cta.secondaryHomeLabel}
          </Button>
        </div>
      </Container>

      <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-muted">
        Scroll
      </span>
    </section>
  );
}
