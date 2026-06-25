"use client";

import { useRef } from "react";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experience-store";
import { smoothstep } from "@/lib/utils";
import type { SceneQuality } from "@/components/canvas/CanvasExperience";

/** Solid glass orb that fades out as the hero scrolls, revealing the particles. */
export function OrbCore({ quality = "high" }: { quality?: SceneQuality }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const detail = quality === "high" ? 64 : 32;

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const material = mesh.material as THREE.MeshPhysicalMaterial;
    const { heroProgress } = useExperienceStore.getState();
    const target = 1 - smoothstep(0.28, 0.62, heroProgress);
    material.transparent = true;
    material.opacity = THREE.MathUtils.damp(material.opacity, target, 5, delta);
    mesh.visible = material.opacity > 0.02;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.55, detail, detail]} />
      <MeshTransmissionMaterial
        transparent
        transmission={1}
        thickness={1.2}
        roughness={0.1}
        chromaticAberration={0.04}
        anisotropy={0.2}
        distortion={0.35}
        distortionScale={0.4}
        temporalDistortion={0.1}
        samples={quality === "high" ? 6 : 4}
        resolution={quality === "high" ? 384 : 256}
        color="#cdb6ff"
        backside={quality === "high"}
      />
    </mesh>
  );
}
