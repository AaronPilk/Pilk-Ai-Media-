"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { HeroParticles } from "@/components/canvas/HeroParticles";

export function CanvasExperience({ maxDpr = 1.75 }: { maxDpr?: number }) {
  const count = maxDpr > 1.5 ? 9000 : 5000;
  return (
    <Canvas
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, 6], fov: 38, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <HeroParticles count={count} />
      <AdaptiveDpr pixelated />
      <Preload all />
    </Canvas>
  );
}
