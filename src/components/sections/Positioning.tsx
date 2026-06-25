import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

export function Positioning() {
  return (
    <section className="section relative z-10">
      <Container>
        <SectionLabel index="01">{site.positioning.eyebrow}</SectionLabel>
        <Reveal>
          <h2 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            {site.positioning.headline}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {site.positioning.points.map((point, i) => (
            <Reveal
              key={point.title}
              delay={i * 60}
              className="bg-surface p-8 transition-colors hover:bg-surface-2"
            >
              <span className="eyebrow opacity-60">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl font-medium">{point.title}</h3>
              <p className="mt-2 text-sm text-muted">{point.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
