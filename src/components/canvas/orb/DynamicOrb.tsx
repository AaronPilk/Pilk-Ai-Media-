"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experience-store";
import { smoothstep } from "@/lib/utils";
import { OrbCore } from "@/components/canvas/orb/OrbCore";
import { OrbParticles } from "@/components/canvas/orb/OrbParticles";
import type { SceneQuality } from "@/components/canvas/CanvasExperience";

export function DynamicOrb({ quality = "high" }: { quality?: SceneQuality }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const { pointer, heroProgress } = useExperienceStore.getState();
    const breakup = smoothstep(0.18, 0.78, heroProgress);
    const exit = smoothstep(0.55, 1.0, heroProgress);
    const time = state.clock.elapsedTime;

    const idleX = Math.sin(time * 0.66) * 0.16;
    const idleY = Math.cos(time * 0.5) * 0.2;

    // Drift off toward the upper-right as the hero leaves.
    const targetX = pointer.x * 0.45 + idleX + exit * 4.8;
    const targetY = pointer.y * 0.28 + idleY + exit * 2.2;
    const targetZ = exit * 1.4;

    group.position.x = THREE.MathUtils.damp(group.position.x, targetX, 3.5, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, targetY, 3.5, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 3.5, delta);

    group.rotation.x += delta * (0.1 + breakup * 0.7);
    group.rotation.y += delta * (0.16 + breakup * 1.05);
    group.rotation.z = Math.sin(time * 0.33) * 0.12;

    const breathing =
      1 + Math.sin(time * 1.05) * 0.045 + Math.sin(time * 0.37) * 0.025;
    group.scale.setScalar(THREE.MathUtils.lerp(breathing, 1.22, breakup));
  });

  return (
    <group ref={groupRef}>
      <OrbCore quality={quality} />
      <OrbParticles quality={quality} />
    </group>
  );
}
