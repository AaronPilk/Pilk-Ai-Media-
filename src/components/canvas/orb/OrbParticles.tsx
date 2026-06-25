"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experience-store";
import { smoothstep } from "@/lib/utils";
import type { SceneQuality } from "@/components/canvas/CanvasExperience";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBreakup;
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
    float delayedProgress = clamp((uBreakup - aDelay * 0.22) / 0.78, 0.0, 1.0);
    float explosion = easeOutCubic(delayedProgress);

    vec3 transformed = position;

    float surfacePulse =
      sin(uTime * 2.2 + position.y * 4.0 + aRandom * 6.2831) * 0.045 * (1.0 - explosion);
    transformed += normalize(position) * surfacePulse;

    transformed += aDirection * explosion * mix(2.8, 6.4, aRandom);
    transformed.y += explosion * explosion * mix(0.5, 2.4, aRandom);
    transformed.x += sin(uTime * 2.0 + aRandom * 10.0) * explosion * 0.22;

    vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize =
      uSize * mix(0.6, 1.2, aRandom) * uPixelRatio * (6.0 / max(0.1, -viewPosition.z));

    vAlpha = delayedProgress * (1.0 - smoothstep(0.72, 1.0, delayedProgress));
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
    float distanceToCenter = length(centered);
    if (distanceToCenter > 0.5) discard;
    float edge = 1.0 - smoothstep(0.25, 0.5, distanceToCenter);
    vec3 color = mix(uColorA, uColorB, vRandom);
    gl_FragColor = vec4(color, edge * vAlpha);
  }
`;

export function OrbParticles({ quality = "high" }: { quality?: SceneQuality }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = quality === "high" ? 9000 : 4000;

  const { positions, directions, randoms, delays } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const directions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const delays = new Float32Array(count);
    const golden = Math.PI * (1 + Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = golden * i;
      const r = 1.55 + (Math.random() - 0.5) * 0.06;
      const sinI = Math.sin(inclination);
      const x = r * sinI * Math.cos(azimuth);
      const y = r * Math.cos(inclination);
      const z = r * sinI * Math.sin(azimuth);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const inv = 1 / r;
      directions[i * 3] = x * inv;
      directions[i * 3 + 1] = y * inv;
      directions[i * 3 + 2] = z * inv;

      randoms[i] = Math.random();
      delays[i] = Math.random();
    }
    return { positions, directions, randoms, delays };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBreakup: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
      },
      uSize: { value: quality === "high" ? 2.6 : 2.2 },
      uColorA: { value: new THREE.Color("#ffffff") },
      uColorB: { value: new THREE.Color("#8b5cf6") },
    }),
    [quality]
  );

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const { heroProgress } = useExperienceStore.getState();
    uniforms.uTime.value += delta;
    // Particles emerge as the hero scrolls (0.45→1) and reverse cleanly on scroll-up.
    const target = smoothstep(0.45, 1.0, heroProgress);
    uniforms.uBreakup.value = THREE.MathUtils.damp(
      uniforms.uBreakup.value,
      target,
      4,
      delta
    );
    pts.visible = uniforms.uBreakup.value > 0.001;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aDirection" args={[directions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        <bufferAttribute attach="attributes-aDelay" args={[delays, 1]} />
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
