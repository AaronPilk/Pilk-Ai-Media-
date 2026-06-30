import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function PageIntro({
  eyebrow,
  title,
  sub,
  bgImage,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  bgImage?: string;
}) {
  return (
    <header
      className="relative z-10 overflow-hidden pb-8 pt-[clamp(7rem,18vh,12rem)]"
      style={
        bgImage
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(10,10,11,0.55), rgba(10,10,11,0.93)), url('${bgImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
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
