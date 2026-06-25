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
    const breakup = smoothstep(0.52, 0.94, heroProgress);
    const time = state.clock.elapsedTime;

    const idleX = Math.sin(time * 0.68) * 0.16;
    const idleY = Math.cos(time * 0.51) * 0.2;

    const targetX = pointer.x * 0.55 + idleX + breakup * 3.2;
    const targetY = pointer.y * 0.35 + idleY + breakup * 1.1;
    const targetZ = breakup * 1.4;

    group.position.x = THREE.MathUtils.damp(group.position.x, targetX, 3.8, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, targetY, 3.8, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 3.2, delta);

    group.rotation.x += delta * (0.12 + heroProgress * 0.75);
    group.rotation.y += delta * (0.18 + heroProgress * 1.1);
    group.rotation.z = Math.sin(time * 0.35) * 0.12;

    const breathing =
      1 + Math.sin(time * 1.05) * 0.045 + Math.sin(time * 0.37) * 0.025;
    const breakupScale = THREE.MathUtils.lerp(breathing, 1.24, breakup);
    group.scale.setScalar(breakupScale);
  });

  return (
    <group ref={groupRef}>
      <OrbCore quality={quality} />
      <OrbParticles quality={quality} />
    </group>
  );
}
