import { appBuilding, apps } from "@/content/apps";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { StoreBadges } from "@/components/apps/StoreBadges";

export function AppBuilding() {
  const { eyebrow, headline, sub, capabilities, pricingLabel } = appBuilding;
  const hero = apps[0]; // Watchmen

  return (
    <section className="section relative z-10" id="app-building">
      <Container>
        <SectionLabel>{eyebrow}</SectionLabel>

        <div className="mt-6 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
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
              <p className="mt-1 text-sm text-muted">
                Live apps on the App Store &amp; Google Play — built by Pilk.ai.
              </p>
              <StoreBadges
                appStore={hero.stores.appStore}
                googlePlay={hero.stores.googlePlay}
                className="mt-5"
              />
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

          {/* Watchmen demo in a phone frame */}
          <Reveal delay={200}>
            <div className="mx-auto w-full max-w-[260px]">
              <div className="overflow-hidden rounded-[2.2rem] border-[6px] border-[#16151a] bg-black shadow-2xl ring-1 ring-white/10">
                <div style={{ aspectRatio: "9 / 19.3" }} className="relative">
                  {hero.video && (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      src={hero.video.src}
                      poster={hero.video.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  )}
                </div>
              </div>
              <p className="mt-4 text-center text-xs uppercase tracking-[0.18em] text-muted">
                {hero.name} · Custom app by Pilk.ai
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
