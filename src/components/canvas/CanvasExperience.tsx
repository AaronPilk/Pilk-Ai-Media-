"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { DynamicOrb } from "@/components/canvas/orb/DynamicOrb";
import { SceneLighting } from "@/components/canvas/SceneLighting";

export type SceneQuality = "high" | "medium";

export function CanvasExperience({
  maxDpr = 1.75,
  quality = "high",
}: {
  maxDpr?: number;
  quality?: SceneQuality;
}) {
  return (
    <Canvas
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, 6], fov: 38, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <SceneLighting />
      <DynamicOrb quality={quality} />
      <AdaptiveDpr pixelated />
      <Preload all />
    </Canvas>
  );
}
