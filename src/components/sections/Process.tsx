import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

export function Process() {
  return (
    <section className="section relative z-10">
      <Container>
        <SectionLabel index="06">{site.process.eyebrow}</SectionLabel>
        <Reveal>
          <h2 className="mt-6 max-w-[16ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            {site.process.headline}
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-line">
          {site.process.steps.map((step, i) => (
            <Reveal
              key={step.n}
              delay={i * 50}
              className="grid grid-cols-[auto_1fr] gap-6 border-b border-line py-8 md:grid-cols-[120px_1fr_2fr] md:gap-10"
            >
              <span className="font-display text-2xl font-semibold text-accent">{step.n}</span>
              <h3 className="text-xl font-medium md:text-2xl">{step.title}</h3>
              <p className="col-span-2 text-sm text-muted md:col-span-1">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
