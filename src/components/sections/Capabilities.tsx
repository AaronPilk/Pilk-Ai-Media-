import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

export function Capabilities() {
  return (
    <section className="section env-light relative z-10">
      <Container>
        <SectionLabel index="04">{site.capabilities.eyebrow}</SectionLabel>
        <Reveal>
          <h2 className="mt-6 max-w-[20ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            {site.capabilities.headline}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {site.capabilities.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <span className="font-display text-4xl font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--text-on-light-muted)]">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
