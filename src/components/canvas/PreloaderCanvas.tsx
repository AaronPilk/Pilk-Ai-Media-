"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { generateOrbNodes, buildConnections } from "@/lib/orb-geometry";

const nodeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uExplode;   // 0 = orb, 1 = fully blasted
  uniform float uPixelRatio;
  uniform float uSize;

  attribute vec3 aDirection;
  attribute float aRandom;

  varying float vAlpha;
  varying float vRandom;

  void main() {
    float e = clamp(uExplode, 0.0, 1.0);
    float blast = pow(e, 0.45); // fast, punchy acceleration

    vec3 p = position;
    // idle breathing before the blast
    p += normalize(position) * sin(uTime * 3.0 + aRandom * 6.2831) * 0.03 * (1.0 - e);

    // detonation — neurons rocket outward + turbulence
    p += aDirection * blast * mix(9.0, 28.0, aRandom);
    p.x += sin(uTime * 3.0 + aRandom * 20.0) * blast * 1.6;
    p.y += cos(uTime * 2.5 + aRandom * 18.0) * blast * 1.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float pulse = 0.7 + 0.3 * sin(uTime * 2.0 + aRandom * 6.2831);
    // pop bigger at the moment of explosion, then streak away
    gl_PointSize =
      uSize * mix(0.55, 1.0, aRandom) * (1.0 + blast * 2.0) * pulse * uPixelRatio *
      (3.5 / max(0.15, -mv.z));

    vAlpha = 1.0 - smoothstep(0.45, 0.95, e);
    vRandom = aRandom;
  }
`;

const nodeFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vRandom;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;
    float core = 1.0 - smoothstep(0.0, 0.5, d);
    float glow = (1.0 - smoothstep(0.1, 0.5, d)) * 0.6;
    vec3 color = mix(uColorA, uColorB, vRandom);
    gl_FragColor = vec4(color, (core + glow) * vAlpha);
  }
`;

const lineVertex = /* glsl */ `
  uniform float uTime;
  uniform float uExplode;
  attribute float aRandom;
  varying float vAlpha;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    float pulse = 0.3 + 0.7 * (0.5 + 0.5 * sin(uTime * 1.8 + aRandom * 6.2831));
    float fade = 1.0 - smoothstep(0.0, 0.18, uExplode); // snap apart instantly
    vAlpha = pulse * fade * 0.5;
  }
`;

const lineFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() { gl_FragColor = vec4(uColor, vAlpha); }
`;

function PreloaderOrb({ explode }: { explode: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const eRef = useRef(0);

  const nodes = useMemo(() => generateOrbNodes(320), []);
  const connections = useMemo(() => buildConnections(nodes), [nodes]);

  const nodeUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uExplode: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
      },
      uSize: { value: 9 },
      uColorA: { value: new THREE.Color("#ffffff") },
      uColorB: { value: new THREE.Color("#8b5cf6") },
    }),
    []
  );

  const lineUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uExplode: { value: 0 },
      uColor: { value: new THREE.Color("#9d6bff") },
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Fast, explosive ramp (~0.4s to full) instead of a slow ease.
    if (explode) eRef.current = Math.min(1, eRef.current + delta / 0.4);
    const e = eRef.current;

    nodeUniforms.uTime.value = t;
    nodeUniforms.uExplode.value = e;
    lineUniforms.uTime.value = t;
    lineUniforms.uExplode.value = e;

    const group = groupRef.current;
    if (group) {
      const vib = 1 - e;
      // hard vibration while charging, spins hard on detonation
      group.position.x = Math.sin(t * 60) * 0.025 * vib;
      group.position.y = Math.cos(t * 52) * 0.025 * vib;
      group.rotation.y += delta * (0.2 + e * 5.0);
      group.scale.setScalar((1 + Math.sin(t * 7) * 0.03 * vib) * (1 + e * 0.5));
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connections.positions, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[connections.randoms, 1]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={lineUniforms}
          vertexShader={lineVertex}
          fragmentShader={lineFragment}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodes.positions, 3]} />
          <bufferAttribute attach="attributes-aDirection" args={[nodes.directions, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[nodes.randoms, 1]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={nodeUniforms}
          vertexShader={nodeVertex}
          fragmentShader={nodeFragment}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export function PreloaderCanvas({ explode }: { explode: boolean }) {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 38, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <PreloaderOrb explode={explode} />
    </Canvas>
  );
}
