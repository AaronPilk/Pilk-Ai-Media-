"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePointerPosition } from "@/hooks/usePointerPosition";
import { useExperienceStore } from "@/stores/experience-store";
import { SceneFallback } from "@/components/canvas/SceneFallback";

/**
 * Background layer. On the light theme the heavy dark WebGL orb is retired in
 * favour of a soft, light backdrop (SceneFallback). Cinematic darkness now
 * lives in image heroes and the listing experience — not behind every page.
 * The scroll-progress wiring is kept so pinned/hero animations still work.
 */
export function SceneCanvas() {
  const pathname = usePathname();
  const setGlobalProgress = useExperienceStore((s) => s.setGlobalProgress);
  const setHeroProgress = useExperienceStore((s) => s.setHeroProgress);
  usePointerPosition();

  useEffect(() => {
    let raf = 0;

    const updateProgress = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const root = document.documentElement;
        const maxScroll = root.scrollHeight - window.innerHeight;
        setGlobalProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);

        const hero = document.querySelector<HTMLElement>('[data-scene="hero"]');
        if (!hero) {
          setHeroProgress(0);
          return;
        }
        const rect = hero.getBoundingClientRect();
        const travelDistance = Math.max(
          window.innerHeight * 0.92,
          hero.offsetHeight * 0.92
        );
        setHeroProgress(Math.min(1, Math.max(0, -rect.top / travelDistance)));
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      cancelAnimationFrame(raf);
    };
  }, [setGlobalProgress, setHeroProgress]);

  // Real-estate pages use a clean light background — no scene at all.
  if (pathname?.startsWith("/real-estate") || pathname?.startsWith("/own-vs-rent")) {
    return null;
  }

  return <SceneFallback />;
}
