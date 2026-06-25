import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative z-10 flex min-h-[70vh] items-center">
      <Container className="text-center">
        <span className="eyebrow text-accent">404</span>
        <h1 className="mt-4" style={{ fontSize: "var(--text-2xl)" }}>
          This page drifted off.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-muted">
          The page you&apos;re looking for doesn&apos;t exist — but the good stuff is one click away.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/" variant="primary" withArrow>
            Back home
          </Button>
          <Button href="/templates" variant="ghost">
            Browse templates
          </Button>
        </div>
      </Container>
    </section>
  );
}
