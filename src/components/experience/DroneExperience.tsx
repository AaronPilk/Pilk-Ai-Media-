"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FRAME_COUNT = 152;
const SCROLL_VH = 720; // length of the scroll track
const frameSrc = (i: number) =>
  `/experience/frames/frame-${String(i + 1).padStart(3, "0")}.jpg`;

type Scene = {
  at: number; // 0..1 scroll position where it peaks
  align: "center" | "left" | "right";
  eyebrow: string;
  title: string;
  body?: string;
  cta?: boolean;
};

// Demo copy — luxury listing + firm. Edit freely; this is a showcase.
const SCENES: Scene[] = [
  { at: 0.05, align: "center", eyebrow: "A Pilk.ai custom build", title: "Most websites sit still.", body: "This one flies." },
  { at: 0.26, align: "left", eyebrow: "The Residence", title: "20 Bayshore Terrace", body: "6 beds · 7 baths · 180° of open water. A home meant to be felt — not skimmed past." },
  { at: 0.48, align: "right", eyebrow: "Selling your home", title: "We sell the feeling.", body: "Cinematic media, targeted reach, and a site buyers can't forget — so your property moves faster, for more." },
  { at: 0.7, align: "left", eyebrow: "The firm", title: "Meridian Estates", body: "Boutique representation, global reach. The name the market's best listings trust." },
  { at: 0.92, align: "center", eyebrow: "Now imagine this for your listing", title: "This is what we can build.", cta: true },
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function DroneExperience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"loading" | "scrub" | "video">("loading");
  const [progress, setProgress] = useState(0); // for loader %

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    // Mobile / reduced-motion: skip the heavy frame scrub, use the video fallback.
    if (!isDesktop || reduce) {
      setMode("video");
      return;
    }

    const images: HTMLImageElement[] = [];
    let loaded = 0;
    let cancelled = false;
    let raf = 0;
    let curFrame = 0;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };

    const draw = (idx: number) => {
      const img = images[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      const W = canvas.width;
      const H = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      ctx.clearRect(0, 0, W, H);
      if (H >= W) {
        // Portrait viewport — fill (cover).
        const s = Math.max(W / iw, H / ih);
        const w = iw * s;
        const h = ih * s;
        ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
      } else {
        // Landscape viewport — blurred cover backdrop + crisp contained footage.
        const sb = Math.max(W / iw, H / ih);
        ctx.filter = "blur(34px) brightness(0.45)";
        ctx.drawImage(img, (W - iw * sb) / 2, (H - ih * sb) / 2, iw * sb, ih * sb);
        ctx.filter = "none";
        const sc = Math.min(W / iw, H / ih);
        const cw = iw * sc;
        const ch = ih * sc;
        ctx.drawImage(img, (W - cw) / 2, (H - ch) / 2, cw, ch);
      }
    };

    const tick = () => {
      const track = trackRef.current;
      if (track) {
        const rect = track.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = clamp(-rect.top / total, 0, 1);
        const target = p * (FRAME_COUNT - 1);
        curFrame += (target - curFrame) * 0.16;
        draw(Math.round(curFrame));

        for (let i = 0; i < SCENES.length; i++) {
          const el = sceneRefs.current[i];
          if (!el) continue;
          const d = Math.abs(p - SCENES[i].at);
          const o = clamp(1 - d / 0.11, 0, 1);
          el.style.opacity = String(o);
          el.style.transform = `translateY(${(1 - o) * 36}px)`;
          el.style.pointerEvents = o > 0.6 ? "auto" : "none";
        }
        if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - p / 0.03, 0, 1));
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        setProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (i === 0) draw(0);
        if (loaded === FRAME_COUNT && !cancelled) {
          setMode("scrub");
          raf = requestAnimationFrame(tick);
        }
      };
      img.src = frameSrc(i);
      images[i] = img;
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ---- Mobile / reduced-motion fallback: video background + stacked scenes ----
  if (mode === "video") {
    return (
      <div className="relative">
        <div className="fixed inset-0 -z-0 bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            className="h-full w-full object-cover opacity-70"
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
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-white/70">{s.eyebrow}</p>
                <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">{s.title}</h2>
                {s.body && <p className="mt-5 text-lg text-white/80">{s.body}</p>}
                {s.cta && (
                  <Link
                    href="/contact?projectType=custom"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-white"
                  >
                    Build something like this →
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
    <div ref={trackRef} style={{ height: `${SCROLL_VH}vh` }} className="relative bg-black">
      <div ref={stickyRef} className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* readability gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {/* Scenes */}
        {SCENES.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            style={{ opacity: 0 }}
            className={`absolute inset-0 flex p-[8vw] pb-[12vh] ${alignCls(s.align)}`}
          >
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">{s.eyebrow}</p>
              <h2 className="mt-4 font-display text-5xl font-semibold text-white drop-shadow-lg xl:text-6xl">
                {s.title}
              </h2>
              {s.body && <p className="mt-5 text-lg text-white/85 drop-shadow">{s.body}</p>}
              {s.cta && (
                <Link
                  href="/contact?projectType=custom"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                >
                  Build something like this →
                </Link>
              )}
            </div>
          </div>
        ))}

        {/* scroll hint */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs uppercase tracking-[0.3em] text-white/70"
        >
          Scroll to fly ↓
        </div>
      </div>

      {/* Loader */}
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
