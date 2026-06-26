"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experience-store";
import { smoothstep } from "@/lib/utils";
import type { OrbNodes } from "@/lib/orb-geometry";
import type { SceneQuality } from "@/components/canvas/CanvasExperience";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBreakup;
  uniform float uExit;
  uniform float uPixelRatio;
  uniform float uSize;

  attribute vec3 aDirection;
  attribute float aRandom;
  attribute float aDelay;

  varying float vAlpha;
  varying float vRandom;

  float easeOutCubic(float value) {
    return 1.0 - pow(1.0 - value, 3.0);
  }

  void main() {
    float delayedBreakup = clamp((uBreakup - aDelay * 0.28) / 0.72, 0.0, 1.0);
    float explosion = easeOutCubic(delayedBreakup);

    vec3 transformed = position;

    float alivePulse =
      sin(uTime * 1.6 + position.y * 4.0 + aRandom * 6.2831) * 0.05 * (1.0 - explosion);
    transformed += normalize(position) * alivePulse;

    transformed += aDirection * explosion * mix(2.2, 7.2, aRandom);
    transformed.x += uExit * mix(2.0, 8.0, aRandom);
    transformed.y += uExit * mix(1.2, 5.5, aRandom);
    transformed.x += sin(uTime * 1.4 + aRandom * 12.0) * explosion * 0.35;

    vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Node pulse — brighter, larger nodes that breathe like a network
    float nodePulse = 0.7 + 0.3 * sin(uTime * 1.8 + aRandom * 6.2831);
    gl_PointSize =
      uSize * mix(0.55, 1.0, aRandom) * nodePulse * uPixelRatio * (3.5 / max(0.15, -viewPosition.z));

    float exitFade = 1.0 - smoothstep(0.55, 1.0, uExit);
    vAlpha = exitFade * (1.0 - smoothstep(0.85, 1.0, delayedBreakup) * 0.25);
    vRandom = aRandom;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vRandom;

  void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float d = length(centered);
    if (d > 0.5) discard;
    float core = 1.0 - smoothstep(0.0, 0.5, d);
    float glow = (1.0 - smoothstep(0.1, 0.5, d)) * 0.6;
    vec3 color = mix(uColorA, uColorB, vRandom);
    gl_FragColor = vec4(color, (core + glow) * vAlpha);
  }
`;

export function OrbParticles({
  nodes,
  quality = "high",
}: {
  nodes: OrbNodes;
  quality?: SceneQuality;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBreakup: { value: 0 },
      uExit: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
      },
      uSize: { value: quality === "high" ? 8 : 6 },
      uColorA: { value: new THREE.Color("#ffffff") },
      uColorB: { value: new THREE.Color("#8b5cf6") },
    }),
    [quality]
  );

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const { heroProgress } = useExperienceStore.getState();
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uBreakup.value = smoothstep(0.18, 0.78, heroProgress);
    uniforms.uExit.value = smoothstep(0.55, 1.0, heroProgress);
    pts.visible = heroProgress < 0.999;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[nodes.positions, 3]} />
        <bufferAttribute attach="attributes-aDirection" args={[nodes.directions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[nodes.randoms, 1]} />
        <bufferAttribute attach="attributes-aDelay" args={[nodes.delays, 1]} />
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
    </points>
  );
}
