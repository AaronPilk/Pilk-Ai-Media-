import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * A page that used to exist and now forwards visitors elsewhere. The site is a
 * static export, so there is no server redirect: a meta refresh moves people
 * on, and the plain link covers browsers that ignore it. Pair it with
 * `noindex` metadata so the stub never appears in search.
 */
export function RedirectNotice({
  to = "/contact/",
  seconds = 0,
  eyebrow,
  heading,
  children,
  linkLabel = "Start a project",
}: {
  to?: string;
  seconds?: number;
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
  linkLabel?: string;
}) {
  return (
    <section className="section relative z-10 pt-[clamp(8rem,18vh,12rem)]">
      {/* React hoists this into <head>. */}
      <meta httpEquiv="refresh" content={`${seconds};url=${to}`} />
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow text-accent">{eyebrow}</span>
          <h1 className="mt-4 text-balance" style={{ fontSize: "var(--text-2xl)" }}>
            {heading}
          </h1>
          <div className="mt-4 space-y-3 text-muted">{children}</div>
          <p className="mt-8">
            <Link href={to} className="btn btn-primary">
              {linkLabel}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
