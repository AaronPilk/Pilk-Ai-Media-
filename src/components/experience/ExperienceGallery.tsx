"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryItem = { img: string; caption: string; video?: string };

/**
 * Motion gallery for the listing experience. Tiles with a `video` autoplay
 * (muted, looping) only while in the viewport — kept light via IntersectionObserver
 * so eight clips never play at once off-screen. Click any tile to open a
 * fullscreen lightbox that plays the clip (or shows the still), with Prev/Next,
 * keyboard support (Esc / ← / →), and a close button. Dark luxe styling.
 */
function GalleryTile({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View ${item.caption}`}
      className="group relative block overflow-hidden rounded-xl border border-white/10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="aspect-[3/4] overflow-hidden">
        {item.video ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            ref={vidRef}
            src={item.video}
            poster={item.img}
            muted
            loop
            playsInline
            preload="none"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.img}
            alt={item.caption}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
      {item.video && (
        <span className="pointer-events-none absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-[10px] text-white/90 backdrop-blur-sm">
          ▶
        </span>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <span className="text-xs uppercase tracking-[0.2em] text-white/85">{item.caption}</span>
      </div>
    </button>
  );
}

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
          <GalleryTile key={g.caption} item={g} onOpen={() => setActive(i)} />
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

          {/* Stage */}
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-2xl text-white/80 transition-colors hover:border-white/40 hover:text-white sm:left-6"
            >
              ‹
            </button>
            {current.video ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                key={current.video}
                src={current.video}
                poster={current.img}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="max-h-full max-w-full rounded-xl object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.img}
                alt={current.caption}
                className="max-h-full max-w-full rounded-xl object-contain"
              />
            )}
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
