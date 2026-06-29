"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FRAME_COUNT = 161;
const SCROLL_VH = 820; // length of the scroll track
const frameSrc = (i: number) =>
  `/experience/frames/frame-${String(i + 1).padStart(3, "0")}.jpg`;

type Stat = { v: string; l: string };
type Scene = {
  at: number;
  align: "center" | "left" | "right";
  eyebrow: string;
  title: string;
  body?: string;
  stats?: Stat[];
  cta?: boolean;
};

// Generic luxury-listing demo copy — reads like a real realtor site.
const SCENES: Scene[] = [
  { at: 0.04, align: "center", eyebrow: "Meridian Estates", title: "Live above it all.", body: "An architectural landmark, perched over open water." },
  { at: 0.19, align: "left", eyebrow: "Now showing", title: "20 Bayshore Terrace", body: "A private waterfront estate unlike anything on the market." },
  { at: 0.35, align: "left", eyebrow: "The residence", title: "Designed to be lived in — and remembered.", stats: [{ v: "6", l: "Beds" }, { v: "8", l: "Baths" }, { v: "11,400", l: "Sq Ft" }, { v: "0.9", l: "Acres" }] },
  { at: 0.51, align: "right", eyebrow: "The design", title: "Floor-to-ceiling glass.", body: "180° of unobstructed water, framed from every room." },
  { at: 0.66, align: "left", eyebrow: "The setting", title: "Moments from the marina.", body: "Minutes to downtown. A world away from everything else." },
  { at: 0.8, align: "right", eyebrow: "Represented by", title: "Meridian Estates", body: "Boutique luxury representation — by private appointment only." },
  { at: 0.93, align: "center", eyebrow: "Offered at $24,500,000", title: "Schedule a private showing.", cta: true },
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function DroneExperience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"loading" | "scrub" | "video">("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop || reduce) {
      setMode("video");
      return;
    }

    const images: HTMLImageElement[] = [];
    let loaded = 0;
    let cancelled = false;
    let raf = 0;
    let curFrame = 0;
    let lastDrawn = -1;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25); // cap density for speed
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      lastDrawn = -1; // force redraw at new size
    };

    const draw = (idx: number) => {
      const img = images[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      const W = canvas.width;
      const H = canvas.height;
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight); // cover
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    };

    const tick = () => {
      const track = trackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = clamp(-rect.top / total, 0, 1);

        curFrame += (p * (FRAME_COUNT - 1) - curFrame) * 0.2;
        const idx = Math.round(curFrame);
        if (idx !== lastDrawn) {
          draw(idx);
          lastDrawn = idx;
        }

        for (let i = 0; i < SCENES.length; i++) {
          const el = sceneRefs.current[i];
          if (!el) continue;
          const o = clamp(1 - Math.abs(p - SCENES[i].at) / 0.1, 0, 1);
          el.style.opacity = String(o);
          el.style.transform = `translateY(${(1 - o) * 30}px)`;
          el.style.pointerEvents = o > 0.6 ? "auto" : "none";
        }
        if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - p / 0.03, 0, 1));
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      const done = () => {
        loaded++;
        setProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (i === 0) draw(0);
        if (loaded === FRAME_COUNT && !cancelled) {
          setMode("scrub");
          raf = requestAnimationFrame(tick);
        }
      };
      img.src = frameSrc(i);
      img.decode().then(done).catch(done);
      images[i] = img;
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ---- Mobile / reduced-motion fallback ----
  if (mode === "video") {
    return (
      <div className="relative z-10">
        <div className="fixed inset-0 z-0 bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            className="h-full w-full object-cover opacity-80"
            src="/experience/drone.mp4"
            poster="/experience/poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10">
          {SCENES.map((s) => (
            <section key={s.title} className="flex min-h-[100svh] items-center justify-center px-6 text-center">
              <div className="max-w-xl [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]">
                <p className="text-xs uppercase tracking-[0.28em] text-accent">{s.eyebrow}</p>
                <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">{s.title}</h2>
                {s.body && <p className="mt-5 text-lg text-white/90">{s.body}</p>}
                {s.stats && (
                  <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-4">
                    {s.stats.map((st) => (
                      <div key={st.l}>
                        <div className="font-display text-3xl font-semibold text-white">{st.v}</div>
                        <div className="text-xs uppercase tracking-widest text-white/60">{st.l}</div>
                      </div>
                    ))}
                  </div>
                )}
                {s.cta && (
                  <Link href="/contact?projectType=custom" className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-white">
                    Schedule a showing →
                  </Link>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  // ---- Desktop scrub experience ----
  const alignCls = (a: Scene["align"]) =>
    a === "left"
      ? "items-end justify-start text-left"
      : a === "right"
        ? "items-end justify-end text-right"
        : "items-center justify-center text-center";

  return (
    <div ref={trackRef} style={{ height: `${SCROLL_VH}vh` }} className="relative z-10 bg-black">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

        {SCENES.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            style={{ opacity: 0 }}
            className={`absolute inset-0 flex p-[8vw] pb-[14vh] ${alignCls(s.align)}`}
          >
            <div className="max-w-xl [text-shadow:0_2px_18px_rgba(0,0,0,0.75)]">
              <p className="text-xs uppercase tracking-[0.32em] text-accent">{s.eyebrow}</p>
              <h2 className="mt-4 font-display text-5xl font-semibold text-white xl:text-6xl">{s.title}</h2>
              {s.body && <p className="mt-5 text-lg text-white/90">{s.body}</p>}
              {s.stats && (
                <div className={`mt-7 flex flex-wrap gap-x-10 gap-y-5 ${s.align === "right" ? "justify-end" : ""}`}>
                  {s.stats.map((st) => (
                    <div key={st.l}>
                      <div className="font-display text-4xl font-semibold text-white">{st.v}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/65">{st.l}</div>
                    </div>
                  ))}
                </div>
              )}
              {s.cta && (
                <Link
                  href="/contact?projectType=custom"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                >
                  Schedule a private showing →
                </Link>
              )}
            </div>
          </div>
        ))}

        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 text-center text-xs uppercase tracking-[0.3em] text-white/70"
        >
          Scroll to explore ↓
        </div>

        {/* progress bar */}
        <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-full bg-white/10">
          <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>

      {mode === "loading" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Loading experience</p>
          <div className="mt-4 h-px w-48 overflow-hidden bg-white/20">
            <div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 font-display text-2xl">{progress}%</p>
        </div>
      )}
    </div>
  );
}
