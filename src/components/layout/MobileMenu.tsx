"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      hidden={!open}
      className="fixed inset-0 z-[70] flex flex-col bg-[rgba(10,10,11,0.98)] backdrop-blur-xl"
      style={{ display: open ? "flex" : "none" }}
    >
      <div className="container-page flex items-center justify-between py-5">
        <span className="font-display text-lg">{site.shortName}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-full border border-line p-2.5"
        >
          <X size={18} aria-hidden />
        </button>
      </div>

      <nav className="container-page flex flex-1 flex-col justify-center gap-2">
        {site.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="font-display text-[clamp(2rem,9vw,3.5rem)] leading-tight tracking-tight transition-colors hover:text-accent"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="container-page flex flex-col gap-3 py-8">
        <Button href={site.cta.inquiry.href} variant="primary" onClick={onClose}>
          {site.cta.inquiry.label}
        </Button>
        <Button href={site.cta.primary.href} variant="ghost" withArrow onClick={onClose}>
          {site.cta.primary.label}
        </Button>
      </div>
    </div>
  );
}
