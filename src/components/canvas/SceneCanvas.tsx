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

class WebGLBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
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
  usePointerPosition();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Fraction of the FIRST viewport scrolled — drives the hero orb shatter.
        setGlobalProgress(window.scrollY / window.innerHeight);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [setGlobalProgress]);

  if (capability === "reduced-motion" || capability === "low") {
    return <SceneFallback />;
  }

  const maxDpr = capability === "high" ? 1.75 : 1.25;

  return (
    <div className="scene-canvas">
      <WebGLBoundary fallback={<SceneFallback />}>
        <Suspense fallback={<SceneFallback />}>
          <CanvasExperience maxDpr={maxDpr} />
        </Suspense>
      </WebGLBoundary>
    </div>
  );
}
