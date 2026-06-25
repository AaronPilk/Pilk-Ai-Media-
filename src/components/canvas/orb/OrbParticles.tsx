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
  uniform float uExit;
  uniform float uPixelRatio;

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
      sin(uTime * 2.0 + position.y * 4.0 + aRandom * 6.2831) * 0.045 * (1.0 - explosion);
    transformed += normalize(position) * alivePulse;

    transformed += aDirection * explosion * mix(2.2, 7.2, aRandom);

    transformed.x += uExit * mix(2.0, 8.0, aRandom);
    transformed.y += uExit * mix(1.2, 5.5, aRandom);

    transformed.x += sin(uTime * 1.4 + aRandom * 12.0) * explosion * 0.35;
    transformed.y += cos(uTime * 1.1 + aRandom * 10.0) * explosion * 0.28;

    vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize =
      mix(2.0, 5.0, aRandom) * uPixelRatio * (3.5 / max(0.15, -viewPosition.z));

    float exitFade = 1.0 - smoothstep(0.55, 1.0, uExit);

    vAlpha =
      mix(0.85, 1.0, explosion) *
      exitFade *
      (1.0 - smoothstep(0.85, 1.0, delayedBreakup) * 0.25);

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
    float softCircle = 1.0 - smoothstep(0.18, 0.5, d);
    vec3 color = mix(uColorA, uColorB, vRandom);
    gl_FragColor = vec4(color, softCircle * vAlpha);
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
      const r = 1.6 + (Math.random() - 0.5) * 0.08;
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
      uExit: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
      },
      uColorA: { value: new THREE.Color("#ffffff") },
      uColorB: { value: new THREE.Color("#8b5cf6") },
    }),
    []
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
