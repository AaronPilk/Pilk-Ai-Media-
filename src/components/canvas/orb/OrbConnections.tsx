"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experience-store";
import { smoothstep } from "@/lib/utils";
import type { OrbConnections as OrbConnectionsData } from "@/lib/orb-geometry";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBreakup;
  uniform float uExit;

  attribute float aRandom;
  varying float vAlpha;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // Signal travelling along the network
    float pulse = 0.3 + 0.7 * (0.5 + 0.5 * sin(uTime * 1.6 + aRandom * 6.2831));
    float breakFade = 1.0 - smoothstep(0.0, 0.4, uBreakup);
    float exitFade = 1.0 - smoothstep(0.55, 1.0, uExit);
    vAlpha = pulse * breakFade * exitFade * 0.5;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uColor, vAlpha);
  }
`;

export function OrbConnections({ connections }: { connections: OrbConnectionsData }) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBreakup: { value: 0 },
      uExit: { value: 0 },
      uColor: { value: new THREE.Color("#9d6bff") },
    }),
    []
  );

  useFrame((state) => {
    const lines = linesRef.current;
    if (!lines) return;
    const { heroProgress } = useExperienceStore.getState();
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uBreakup.value = smoothstep(0.18, 0.78, heroProgress);
    uniforms.uExit.value = smoothstep(0.55, 1.0, heroProgress);
    lines.visible = heroProgress < 0.6;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[connections.positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[connections.randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
