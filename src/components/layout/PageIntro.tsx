import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function PageIntro({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <header className="relative z-10 pb-8 pt-[clamp(7rem,18vh,12rem)]">
      <Container>
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1 className="mt-6 max-w-[18ch] text-balance" style={{ fontSize: "var(--text-2xl)" }}>
          {title}
        </h1>
        {sub && <p className="mt-6 max-w-xl text-lg text-muted">{sub}</p>}
      </Container>
    </header>
  );
}
