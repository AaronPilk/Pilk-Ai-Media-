import type { Metadata } from "next";
import { appBuilding, apps } from "@/content/apps";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { AppShowcase } from "@/components/apps/AppShowcase";

export const metadata: Metadata = buildMetadata({
  title: "Custom App Building",
  description:
    "Custom software development — mobile apps for iOS & Android, internal tools, AI-powered products, dashboards, and automations. Designed and built end to end, starting at $15,000.",
  path: "/apps",
});

export default function AppsPage() {
  const { headline, sub, capabilities, whatYouGet, process, pricingLabel, pricingNote } = appBuilding;

  return (
    <>
      <header
        className="relative z-10 overflow-hidden pb-8 pt-[clamp(7rem,18vh,12rem)]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(10,10,11,0.62), rgba(10,10,11,0.94)), url('/brand/brand-app.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container>
          <SectionLabel>Custom App Building</SectionLabel>
          <h1 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-hero)" }}>
            {headline}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted">{sub}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact?projectType=custom&service=app" variant="primary" withArrow>
              Start an app project
            </Button>
            <Button href="#work" variant="ghost">
              See the apps
            </Button>
          </div>
        </Container>
      </header>

      {/* Showcased apps */}
      <section id="work" className="section relative z-10 pt-8">
        <Container>
          <SectionLabel index="01">Apps we&apos;ve built</SectionLabel>
          <h2 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            Real products, designed and shipped.
          </h2>
          <div className="mt-16 flex flex-col gap-24">
            {apps.map((app, i) => (
              <AppShowcase key={app.slug} app={app} reverse={i % 2 === 1} />
            ))}
          </div>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="02">What we build</SectionLabel>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 60}>
                <span className="font-display text-3xl font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-medium">{c.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--text-on-light-muted)]">{c.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* What you get */}
      <section className="section relative z-10">
        <Container>
          <SectionLabel index="03">What you get</SectionLabel>
          <div className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {whatYouGet.map((w, i) => (
              <Reveal key={w} delay={i * 40} className="border-t border-line pt-4 text-sm">
                {w}
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="section env-light relative z-10">
        <Container>
          <SectionLabel index="04">How a build works</SectionLabel>
          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 70}>
                <span className="font-display text-3xl font-semibold text-accent">{p.step}</span>
                <h3 className="mt-3 text-lg font-medium">{p.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--text-on-light-muted)]">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing + CTA */}
      <section className="section relative z-10">
        <Container>
          <SectionLabel index="05">Investment</SectionLabel>
          <div className="mt-8 max-w-2xl">
            <p className="font-display text-4xl font-semibold">{pricingLabel}</p>
            <p className="mt-4 text-muted">{pricingNote}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/contact?projectType=custom&service=app" variant="primary" withArrow>
                Start an app project
              </Button>
              <Button href="/contact?projectType=custom&service=app" variant="ghost">
                Book a scoping call
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
