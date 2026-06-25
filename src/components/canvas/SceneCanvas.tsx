"use client";

import { Component, type ReactNode, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { usePointerPosition } from "@/hooks/usePointerPosition";
import { useExperienceStore } from "@/stores/experience-store";
import { SceneFallback } from "@/components/canvas/SceneFallback";

const CanvasExperience = dynamic(
  () => import("@/components/canvas/CanvasExperience").then((m) => m.CanvasExperience),
  { ssr: false, loading: () => null }
);

class WebGLBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[scene] WebGL scene failed, using fallback:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function SceneCanvas() {
  const capability = useDeviceCapability();
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
        // Progress reaches 1 shortly before the hero has fully left the viewport.
        const travelDistance = Math.max(
          window.innerHeight * 0.9,
          hero.offsetHeight * 0.9
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

  if (capability === "reduced-motion" || capability === "low") {
    return <SceneFallback />;
  }

  const quality = capability === "high" ? "high" : "medium";
  const maxDpr = capability === "high" ? 1.75 : 1.25;

  return (
    <div className="scene-canvas">
      <WebGLBoundary fallback={<SceneFallback />}>
        <Suspense fallback={<SceneFallback />}>
          <CanvasExperience maxDpr={maxDpr} quality={quality} />
        </Suspense>
      </WebGLBoundary>
    </div>
  );
}
