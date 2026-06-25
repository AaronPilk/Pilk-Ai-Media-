// Starter liquid displacement vertex shader (prototype — not yet wired to a material).
uniform float uTime;
uniform float uProgress;
uniform vec2 uPointer;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vDisplacement;

void main() {
  vec3 transformed = position;

  float waveA = sin(position.y * 3.4 + uTime * 1.25) * 0.065;
  float waveB = sin(position.x * 4.8 - uTime * 0.85) * 0.045;
  float waveC = cos(position.z * 5.2 + uTime * 0.65) * 0.035;

  float pointerInfluence = (uPointer.x * position.x + uPointer.y * position.y) * 0.025;
  float displacement = waveA + waveB + waveC + pointerInfluence + uProgress * 0.08;

  transformed += normal * displacement;

  vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vWorldPosition = worldPosition.xyz;
  vDisplacement = displacement;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
