"use client";

export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-6, -2, 2]} intensity={30} color="#7c3aed" />
      <pointLight position={[6, 2, -4]} intensity={18} color="#9d6bff" />
    </>
  );
}
