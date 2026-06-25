"use client";

import { useRef } from "react";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experience-store";

export function HeroMaterial() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Read from store imperatively — no React re-render per frame.
    const { pointer, globalProgress } = useExperienceStore.getState();

    mesh.rotation.x = THREE.MathUtils.damp(
      mesh.rotation.x,
      pointer.y * 0.18 + globalProgress * 0.65,
      4,
      delta
    );
    mesh.rotation.y = THREE.MathUtils.damp(
      mesh.rotation.y,
      pointer.x * 0.28 + globalProgress * 1.2,
      4,
      delta
    );

    const targetScale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.025;
    mesh.scale.setScalar(THREE.MathUtils.damp(mesh.scale.x, targetScale, 3, delta));

    mesh.position.y = THREE.MathUtils.damp(
      mesh.position.y,
      globalProgress * -1.4,
      3,
      delta
    );
  });

  return (
    <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.28}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.55, 24]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={1.2}
          roughness={0.1}
          chromaticAberration={0.04}
          anisotropy={0.2}
          distortion={0.35}
          distortionScale={0.4}
          temporalDistortion={0.1}
          samples={6}
          resolution={384}
          color="#cdb6ff"
          backside
        />
      </mesh>
    </Float>
  );
}
