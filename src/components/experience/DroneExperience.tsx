"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ExperienceConfig, ExpScene } from "@/content/experiences";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Fraction of the scroll track used by the intro (welcome + smoke reveal).
const INTRO = 0.06;

export function DroneExperience({ config }: { config: ExperienceConfig }) {
  const { scrollVh, video, scrubVideo, poster, scenes, ctaHref, ctaLabel } = config;
  const src = scrubVideo ?? video;

  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introWrapRef = useRef<HTMLDivElement>(null);
  const introBaseRef = useRef<HTMLDivElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);
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

    const v = videoRef.current!;
    let raf = 0;
    let started = false;
    let curT = 0;

    const tick = () => {
      const track = trackRef.current;
      if (track && v.duration) {
        const rect = track.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = clamp(-rect.top / total, 0, 1);
        const fp = clamp((p - INTRO) / (1 - INTRO), 0, 1);

        // Smoothly ease the playhead toward the scroll target.
        const targetT = fp * (v.duration - 0.05);
        curT += (targetT - curT) * 0.1;
        if (Math.abs(v.currentTime - curT) > 0.02) {
          try {
            v.currentTime = curT;
          } catch {
            /* ignore mid-seek */
          }
        }

        for (let i = 0; i < scenes.length; i++) {
          const el = sceneRefs.current[i];
          if (!el) continue;
          const o = clamp(1 - Math.abs(fp - scenes[i].at) / 0.14, 0, 1);
          el.style.opacity = String(o);
          el.style.transform = `translateY(${(1 - o) * 30}px)`;
          el.style.pointerEvents = o > 0.6 ? "auto" : "none";
        }

        const showIntro = p < INTRO + 0.02;
        if (introWrapRef.current) introWrapRef.current.style.display = showIntro ? "block" : "none";
        if (showIntro) {
          const baseO = clamp(1 - p / (INTRO * 0.6), 0, 1);
          if (introBaseRef.current) {
            introBaseRef.current.style.opacity = String(baseO);
            introBaseRef.current.style.pointerEvents = baseO > 0.5 ? "auto" : "none";
          }
          if (introTextRef.current) introTextRef.current.style.opacity = String(baseO);
          if (smokeRef.current) smokeRef.current.style.opacity = String(clamp(1 - p / INTRO, 0, 1) * 0.95);
        }
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      }
      raf = requestAnimationFrame(tick);
    };

    const begin = () => {
      if (started) return;
      started = true;
      setMode("scrub");
      raf = requestAnimationFrame(tick);
    };

    const onProgress = () => {
      if (!v.duration) return;
      const end = v.buffered.length ? v.buffered.end(v.buffered.length - 1) : 0;
      setProgress(Math.round((end / v.duration) * 100));
      if (end >= v.duration * 0.96) begin();
    };

    v.muted = true;
    v.addEventListener("progress", onProgress);
    v.addEventListener("loadeddata", onProgress);
    // Fallback: once it can play through, give it a moment to buffer then start.
    const onCanPlay = () => setTimeout(begin, 1500);
    v.addEventListener("canplaythrough", onCanPlay);
    v.load();

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("progress", onProgress);
      v.removeEventListener("loadeddata", onProgress);
      v.removeEventListener("canplaythrough", onCanPlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StatRow = ({ s, center }: { s: ExpScene; center?: boolean }) =>
    s.stats ? (
      <div className={`mt-7 flex flex-wrap gap-x-10 gap-y-5 ${center ? "justify-center" : s.align === "right" ? "justify-end" : ""}`}>
        {s.stats.map((st) => (
          <div key={st.l}>
            <div className="font-display text-4xl font-semibold text-white">{st.v}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/65">{st.l}</div>
          </div>
        ))}
      </div>
    ) : null;

  // ---- Mobile / reduced-motion fallback ----
  if (mode === "video") {
    return (
      <div className="relative z-10">
        <div className="fixed inset-0 z-0 bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video className="h-full w-full object-cover opacity-80" src={video} poster={poster} autoPlay muted loop playsInline preload="metadata" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10">
          <section className="relative flex min-h-[100svh] items-center justify-center px-6 text-center">
            <div className="exp-smoke pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative [text-shadow:0_2px_24px_rgba(0,0,0,0.8)]">
              <p className="eyebrow text-white/70">{config.site.brand}</p>
              <h1 className="mt-4 max-w-[14ch] font-display text-5xl font-semibold text-white">
                Welcome to your new home.
              </h1>
              <p className="mt-8 text-xs uppercase tracking-[0.35em] text-white/65">Scroll to experience ↓</p>
            </div>
          </section>
          {scenes.map((s) => (
            <section key={s.title} className="flex min-h-[100svh] items-center justify-center px-6 text-center">
              <div className="max-w-xl [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]">
                <p className="text-xs uppercase tracking-[0.28em] text-accent">{s.eyebrow}</p>
                <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">{s.title}</h2>
                {s.body && <p className="mt-5 text-lg text-white/90">{s.body}</p>}
                <StatRow s={s} center />
                {s.cta && (
                  <Link href={ctaHref} className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-white">
                    {ctaLabel}
                  </Link>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  // ---- Desktop video-scrub experience ----
  const alignCls = (a: ExpScene["align"]) =>
    a === "left" ? "items-end justify-start text-left" : a === "right" ? "items-end justify-end text-right" : "items-center justify-center text-center";

  return (
    <div ref={trackRef} style={{ height: `${scrollVh}vh` }} className="relative z-10 bg-black">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

        {scenes.map((s, i) => (
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
              <StatRow s={s} />
              {s.cta && (
                <Link href={ctaHref} className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5">
                  {ctaLabel}
                </Link>
              )}
            </div>
          </div>
        ))}

        {/* Intro — welcome + smoke-screen reveal */}
        <div ref={introWrapRef} className="absolute inset-0 z-30">
          <div ref={introBaseRef} className="absolute inset-0 bg-[#0b0b0e]">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              className="h-full w-full object-cover"
              src="/experience/clips/intro.mp4"
              poster="/experience/clips/intro.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/75" />
          </div>
          <div ref={smokeRef} className="exp-smoke pointer-events-none absolute inset-0" />
          <div
            ref={introTextRef}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.8)]"
          >
            <p className="eyebrow text-white/70">{config.site.brand}</p>
            <h1 className="mt-5 max-w-[14ch] font-display text-6xl font-semibold text-white xl:text-7xl">
              Welcome to your new home.
            </h1>
            <p className="mt-10 text-xs uppercase tracking-[0.4em] text-white/65">Scroll to experience ↓</p>
          </div>
        </div>

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
