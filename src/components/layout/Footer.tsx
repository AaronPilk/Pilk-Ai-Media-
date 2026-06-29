import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-line bg-surface">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pilk-logo-dark.svg"
            alt="Pilk.ai — One Stop Shop Brand Building"
            className="h-24 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm text-muted">{site.footer.blurb}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted">
            {site.location}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
          <span className="eyebrow mb-1">Explore</span>
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="text-muted hover:text-ink">
            Contact
          </Link>
        </nav>

        <div className="flex flex-col gap-3 text-sm">
          <span className="eyebrow mb-1">Connect</span>
          <a href={`mailto:${site.contact.email}`} className="text-muted hover:text-ink">
            {site.contact.email}
          </a>
          <a href={site.contact.phoneHref} className="text-muted hover:text-ink">
            {site.contact.phone}
          </a>
          <div className="mt-2 flex gap-4">
            {site.social.map((s) => (
              <a key={s.label} href={s.href} className="text-muted hover:text-ink">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Container>

      <Container className="flex flex-col items-start justify-between gap-3 border-t border-line py-6 text-xs text-muted md:flex-row md:items-center">
        <span>
          © {year} {site.footer.legalName}. All rights reserved.
        </span>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
        </div>
      </Container>
    </footer>
  );
}
