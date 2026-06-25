"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experience-store";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;   // 0 = formed orb, 1 = fully shattered / gone
  uniform vec2  uPointer;
  uniform float uSize;

  attribute vec3 aDir;
  attribute float aScale;
  attribute float aSeed;

  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 p = position;

    // Alive idle motion — breathing + drifting
    float t = uTime * 0.6;
    p += aDir * sin(t + aSeed * 6.2831) * 0.05;
    p.x += sin(t * 0.7 + p.y * 2.0) * 0.04;
    p.y += cos(t * 0.55 + p.x * 2.0) * 0.04;

    // Pointer parallax
    p.xy += uPointer * 0.22 * aScale;

    // Shatter: blow outward along each particle's direction, lift up, swirl
    float s = uProgress;
    float burst = s * (3.5 + aSeed * 5.0);
    p += aDir * burst;
    p.y += s * s * 6.0;
    float ang = s * (2.0 + aSeed * 4.0);
    float ca = cos(ang), sa = sin(ang);
    p.xz = mat2(ca, -sa, sa, ca) * p.xz;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * (300.0 / -mv.z) * (1.0 - s * 0.4);

    vAlpha = 1.0 - smoothstep(0.15, 0.95, s);
    vMix = aScale;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vMix;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColorA, uColorB, vMix);
    gl_FragColor = vec4(col, a * vAlpha);
  }
`;

export function HeroParticles({ count = 8000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, dirs, scales, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const dirs = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    const golden = Math.PI * (1 + Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const tt = i / count;
      const inclination = Math.acos(1 - 2 * tt);
      const azimuth = golden * i;
      const r = 1.6 + (Math.random() - 0.5) * 0.22;
      const sinI = Math.sin(inclination);
      const x = r * sinI * Math.cos(azimuth);
      const y = r * Math.cos(inclination);
      const z = r * sinI * Math.sin(azimuth);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const inv = 1 / r;
      dirs[i * 3] = x * inv;
      dirs[i * 3 + 1] = y * inv;
      dirs[i * 3 + 2] = z * inv;

      scales[i] = 0.35 + Math.random() * 0.9;
      seeds[i] = Math.random();
    }
    return { positions, dirs, scales, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uSize: { value: 0.085 },
      uColorA: { value: new THREE.Color("#ffffff") },
      uColorB: { value: new THREE.Color("#8b5cf6") },
    }),
    []
  );

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const { pointer, globalProgress } = useExperienceStore.getState();

    uniforms.uTime.value += delta;
    uniforms.uPointer.value.set(pointer.x, pointer.y);

    // globalProgress here = scroll fraction of the first viewport
    const shatter = THREE.MathUtils.smoothstep(globalProgress, 0.12, 0.92);
    uniforms.uProgress.value = THREE.MathUtils.damp(
      uniforms.uProgress.value,
      shatter,
      6,
      delta
    );

    pts.rotation.y += delta * 0.05;
    pts.rotation.x = THREE.MathUtils.damp(pts.rotation.x, pointer.y * 0.25, 3, delta);
    pts.rotation.z = THREE.MathUtils.damp(pts.rotation.z, pointer.x * 0.1, 3, delta);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aDir" args={[dirs, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
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
