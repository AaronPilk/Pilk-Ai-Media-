// Starter liquid fresnel fragment shader (prototype — not yet wired to a material).
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uAccent;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vDisplacement;

void main() {
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(viewDirection, normalize(vNormal)), 0.0), 2.4);
  float gradient = smoothstep(-0.12, 0.12, vDisplacement);

  vec3 baseColor = mix(uColorA, uColorB, gradient);
  vec3 finalColor = mix(baseColor, uAccent, fresnel * 0.7);
  finalColor += fresnel * 0.25;

  gl_FragColor = vec4(finalColor, 0.9);
}
