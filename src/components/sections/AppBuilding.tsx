import Link from "next/link";
import { appBuilding } from "@/content/apps";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

export function AppBuilding() {
  const { eyebrow, headline, sub, capabilities, pricingLabel } = appBuilding;

  return (
    <section className="section relative z-10" id="app-building">
      <Container>
        <SectionLabel>{eyebrow}</SectionLabel>

        <div className="mt-6 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <h2 className="max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
                {headline}
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-6 max-w-xl text-lg text-muted">{sub}</p>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {capabilities.slice(0, 4).map((c, i) => (
                <Reveal key={c.title} delay={120 + i * 60}>
                  <h3 className="text-base font-medium">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{c.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={360}>
              <p className="mt-10 font-display text-2xl font-semibold">{pricingLabel}</p>
              <p className="mt-1 text-sm text-muted">Custom apps, scoped to what you need.</p>
            </Reveal>

            <Reveal delay={420}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/apps" variant="primary" withArrow>
                  Explore app building
                </Button>
                <Button href="/contact?projectType=custom&service=app" variant="ghost">
                  Start an app project
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            <div className="relative mx-auto w-full max-w-lg">
              <div className="aspect-[16/10] w-full overflow-hidden rounded-md border border-line">
                <FauxBrowser
                  image={appBuilding.caseStudy.shots[0]?.src}
                  alt={appBuilding.caseStudy.shots[0]?.alt}
                  url="app.pilk.ai"
                  className="h-full w-full"
                />
              </div>
              <div className="absolute -bottom-8 -right-2 w-28 overflow-hidden rounded-[20px] border border-line bg-surface shadow-2xl sm:w-36">
                <div style={{ aspectRatio: "9 / 16" }}>
                  <FauxBrowser
                    image={appBuilding.caseStudy.shots[1]?.src}
                    alt={appBuilding.caseStudy.shots[1]?.alt}
                    variant="mobile"
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
