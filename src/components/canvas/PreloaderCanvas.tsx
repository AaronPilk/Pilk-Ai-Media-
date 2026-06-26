"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { generateOrbNodes, buildConnections } from "@/lib/orb-geometry";

const nodeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uExplode;
  uniform float uPixelRatio;
  uniform float uSize;

  attribute vec3 aDirection;
  attribute float aRandom;

  varying float vAlpha;
  varying float vRandom;

  float easeOutCubic(float v) { return 1.0 - pow(1.0 - v, 3.0); }

  void main() {
    float e = easeOutCubic(clamp(uExplode, 0.0, 1.0));
    vec3 p = position;
    // breathing while idle
    p += normalize(position) * sin(uTime * 3.0 + aRandom * 6.2831) * 0.03 * (1.0 - e);
    // neurons fly outward on explode
    p += aDirection * e * mix(3.2, 9.0, aRandom);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float pulse = 0.7 + 0.3 * sin(uTime * 2.0 + aRandom * 6.2831);
    gl_PointSize = uSize * mix(0.55, 1.0, aRandom) * pulse * uPixelRatio * (3.5 / max(0.15, -mv.z));

    vAlpha = 1.0 - smoothstep(0.55, 1.0, e);
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
    float fade = 1.0 - smoothstep(0.0, 0.4, uExplode);
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
    eRef.current = THREE.MathUtils.damp(eRef.current, explode ? 1 : 0, 6, delta);

    nodeUniforms.uTime.value = t;
    nodeUniforms.uExplode.value = eRef.current;
    lineUniforms.uTime.value = t;
    lineUniforms.uExplode.value = eRef.current;

    const group = groupRef.current;
    if (group) {
      const vib = 1 - eRef.current;
      // fast vibration while idle, settles as it explodes
      group.position.x = Math.sin(t * 55) * 0.02 * vib;
      group.position.y = Math.cos(t * 48) * 0.02 * vib;
      group.rotation.y += delta * 0.2;
      group.scale.setScalar((1 + Math.sin(t * 7) * 0.03 * vib) * (1 + eRef.current * 0.15));
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
