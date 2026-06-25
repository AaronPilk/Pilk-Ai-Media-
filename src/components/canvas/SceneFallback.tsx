/** Static gradient shown when WebGL is unavailable, on low-end devices, or reduced-motion. */
export function SceneFallback() {
  return <div className="canvas-fallback" aria-hidden="true" />;
}
