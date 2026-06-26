"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experience-store";
import { smoothstep } from "@/lib/utils";
import { generateOrbNodes, buildConnections } from "@/lib/orb-geometry";
import { OrbParticles } from "@/components/canvas/orb/OrbParticles";
import { OrbConnections } from "@/components/canvas/orb/OrbConnections";
import type { SceneQuality } from "@/components/canvas/CanvasExperience";

export function DynamicOrb({ quality = "high" }: { quality?: SceneQuality }) {
  const groupRef = useRef<THREE.Group>(null);

  const nodeCount = quality === "high" ? 340 : 190;
  const nodes = useMemo(() => generateOrbNodes(nodeCount), [nodeCount]);
  const connections = useMemo(() => buildConnections(nodes), [nodes]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const { pointer, heroProgress } = useExperienceStore.getState();
    const breakup = smoothstep(0.18, 0.78, heroProgress);
    const exit = smoothstep(0.55, 1.0, heroProgress);
    const time = state.clock.elapsedTime;

    const idleX = Math.sin(time * 0.66) * 0.16;
    const idleY = Math.cos(time * 0.5) * 0.2;

    const targetX = pointer.x * 0.45 + idleX + exit * 4.8;
    const targetY = pointer.y * 0.28 + idleY + exit * 2.2;
    const targetZ = exit * 1.4;

    group.position.x = THREE.MathUtils.damp(group.position.x, targetX, 3.5, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, targetY, 3.5, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 3.5, delta);

    // Pointer-reactive tilt + slow living rotation
    group.rotation.y += delta * (0.12 + breakup * 0.8);
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      pointer.y * 0.3 + time * 0.02,
      2.5,
      delta
    );
    group.rotation.z = Math.sin(time * 0.3) * 0.1;

    const breathing = 1 + Math.sin(time * 0.9) * 0.04;
    group.scale.setScalar(THREE.MathUtils.lerp(breathing, 1.2, breakup));
  });

  return (
    <group ref={groupRef}>
      <OrbConnections connections={connections} />
      <OrbParticles nodes={nodes} quality={quality} />
    </group>
  );
}
