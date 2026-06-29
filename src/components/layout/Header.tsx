"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[65] transition-colors duration-500",
          scrolled ? "bg-[rgba(10,10,11,0.72)] backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <div
          className={cn(
            "container-page flex items-center justify-between transition-all duration-500",
            scrolled ? "py-3.5" : "py-5"
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-3"
            data-cursor="default"
            aria-label="Pilk.ai — One Stop Shop Brand Building — home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/pilk-mark.svg" alt="" aria-hidden="true" className="h-9 w-9" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold uppercase tracking-tight">
                Pilk<span className="text-accent"> AI</span>
              </span>
              <span className="mt-1 hidden text-[8px] font-semibold uppercase tracking-[0.22em] text-muted sm:block">
                One Stop Shop Brand Building
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button href={site.cta.primary.href} variant="ghost" withArrow data-cursor="open">
              {site.cta.primary.label}
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden rounded-full border border-line p-2.5"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={18} aria-hidden />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
