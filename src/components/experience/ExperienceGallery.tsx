"use client";

import { useCallback, useEffect, useState } from "react";

export type GalleryItem = { img: string; caption: string };

/**
 * Photo-gallery grid for the listing experience with a fullscreen lightbox.
 * Click any tile to open a dark overlay with the large image + caption,
 * Prev/Next arrows, keyboard support (Esc to close, ←/→ to navigate),
 * and a close button. Dark luxe styling to match the rest of the site.
 */
export function ExperienceGallery({ gallery }: { gallery: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % gallery.length)),
    [gallery.length],
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length)),
    [gallery.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    // Prevent the page scrolling behind the lightbox.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, next, prev]);

  const current = active === null ? null : gallery[active];

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {gallery.map((g, i) => (
          <button
            key={g.caption}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View ${g.caption}`}
            className="group relative block overflow-hidden rounded-xl border border-white/10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="aspect-[3/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.img}
                alt={g.caption}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <span className="text-xs uppercase tracking-[0.2em] text-white/85">{g.caption}</span>
            </div>
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <span className="text-xs uppercase tracking-[0.25em] text-white/60">
              {(active ?? 0) + 1} / {gallery.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Image stage */}
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-2xl text-white/80 transition-colors hover:border-white/40 hover:text-white sm:left-6"
            >
              ‹
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.img}
              alt={current.caption}
              className="max-h-full max-w-full rounded-xl object-contain"
            />
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-2xl text-white/80 transition-colors hover:border-white/40 hover:text-white sm:right-6"
            >
              ›
            </button>
          </div>

          {/* Caption */}
          <div className="px-5 pb-8 pt-2 text-center sm:px-8">
            <span className="text-sm uppercase tracking-[0.25em] text-white/80">
              {current.caption}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
