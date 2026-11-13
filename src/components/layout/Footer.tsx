import Link from "next/link";
import { site } from "@/content/site";
import { serviceCatalog } from "@/content/services";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();
  const profiles = site.profiles.filter((p) =>
    (site.footerProfiles as readonly string[]).includes(p.label)
  );

  return (
    <footer className="relative z-10 border-t border-line bg-surface">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          {/* Logo swaps with the theme (light-on-dark vs dark-on-light) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pilk-logo-dark.svg"
            alt="Pilk.ai — One Stop Shop Brand Building"
            className="logo-on-dark h-24 w-auto"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pilk-logo-light.svg"
            alt="Pilk.ai — One Stop Shop Brand Building"
            className="logo-on-light h-24 w-auto"
          />
          <p className="mt-4 max-w-sm text-sm text-muted">{site.footer.blurb}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted">
            {site.location}
          </p>
        </div>

        <nav aria-label="Services" className="flex flex-col gap-3 text-sm">
          <Link href="/services/" className="eyebrow mb-1 hover:text-ink">
            Services
          </Link>
          {serviceCatalog.map((s) => (
            <Link key={s.href} href={s.href} className="text-muted hover:text-ink">
              {s.name}
            </Link>
          ))}
          <Link href="/st-petersburg-tampa-bay/" className="text-muted hover:text-ink">
            St. Petersburg &amp; Tampa Bay
          </Link>
        </nav>

        <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
          <span className="eyebrow mb-1">Explore</span>
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link href="/templates/" className="text-muted hover:text-ink">
            Templates
          </Link>
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
          {profiles.length > 0 && (
            <>
              <span className="eyebrow mb-1 mt-4">Find us on</span>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {profiles.map((p) => (
                  <li key={p.href}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="text-muted hover:text-ink"
                    >
                      {p.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Container>

      <Container className="flex flex-col items-start justify-between gap-3 border-t border-line py-6 text-xs text-muted md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <span>
            © {year} {site.footer.legalName}. All rights reserved.
          </span>
          <span>{site.footer.brandLine}</span>
        </div>
        <div className="flex gap-5">
          <Link href="/privacy/" className="hover:text-ink">
            Privacy Policy
          </Link>
          <Link href="/terms/" className="hover:text-ink">
            Terms of Service
          </Link>
        </div>
      </Container>
    </footer>
  );
}
