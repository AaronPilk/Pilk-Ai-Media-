"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { WebsiteTemplate } from "@/types/template";
import { features } from "@/lib/features";
import { FauxBrowser } from "@/components/templates/FauxBrowser";

export function TemplatePreviewModal({
  template,
  open,
  onClose,
}: {
  template: WebsiteTemplate;
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const canIframe = features.projectIframes && template.liveUrl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${template.name} preview`}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute -top-12 right-0 rounded-full border border-line p-2.5 text-white"
        >
          <X size={18} aria-hidden />
        </button>

        {canIframe ? (
          <div className="faux aspect-[16/10] w-full">
            <iframe
              src={template.liveUrl}
              title={`${template.name} live preview`}
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-[16/10] w-full">
            <FauxBrowser
              accent={template.accent}
              url={`${template.slug}.pilk.ai`}
              image={template.preview.desktop}
            />
          </div>
        )}
      </div>
    </div>
  );
}
