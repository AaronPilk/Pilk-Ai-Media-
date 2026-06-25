"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { HeroMaterial } from "@/components/canvas/HeroMaterial";
import { SceneLighting } from "@/components/canvas/SceneLighting";

export function CanvasExperience({ maxDpr = 1.75 }: { maxDpr?: number }) {
  return (
    <Canvas
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, 6], fov: 38, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop="always"
    >
      <SceneLighting />
      <HeroMaterial />
      <AdaptiveDpr pixelated />
      <Preload all />
    </Canvas>
  );
}
