import { Button } from "@/components/ui/Button";

export function ContactSuccess({ firstName }: { firstName?: string }) {
  return (
    <div className="rounded-md border border-line bg-surface p-10 text-center">
      <span className="eyebrow text-accent">Received</span>
      <h2 className="mt-4 text-balance" style={{ fontSize: "var(--text-xl)" }}>
        Thanks{firstName ? `, ${firstName}` : ""}. We&apos;ll be in touch.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm text-muted">
        We got your inquiry and sent a confirmation to your email. In the meantime, take a look at
        the work and templates.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/templates" variant="primary" withArrow>
          Browse templates
        </Button>
        <Button href="/work" variant="ghost">
          See the work
        </Button>
      </div>
    </div>
  );
}
