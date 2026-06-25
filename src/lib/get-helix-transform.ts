export type HelixItemTransform = {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  scale: number;
  opacity: number;
};

export function getHelixTransform(
  itemIndex: number,
  progressIndex: number,
  radius = 360,
  verticalSpacing = 300
): HelixItemTransform {
  const offset = itemIndex - progressIndex;
  const angle = offset * 0.72;

  return {
    x: Math.sin(angle) * radius,
    y: offset * verticalSpacing,
    z: Math.cos(angle) * radius - radius,
    rotateX: offset * -4,
    rotateY: Math.sin(angle) * -24,
    scale: Math.max(0.62, 1 - Math.abs(offset) * 0.12),
    opacity: Math.max(0.06, 1 - Math.abs(offset) * 0.3),
  };
}
