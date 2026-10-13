import type { Camera, Point } from './contracts';
export const screenToWorld = (p: { x: number; y: number }, c: Camera) => ({
  x: (p.x - c.x) / c.k,
  y: (p.y - c.y) / c.k,
});
export function zoomAt(
  c: Camera,
  p: { x: number; y: number },
  factor: number,
): Camera {
  const k = Math.max(0.08, Math.min(4, c.k * factor)),
    w = screenToWorld(p, c);
  return { k, x: p.x - w.x * k, y: p.y - w.y * k };
}
export function fitCamera(
  points: Point[],
  width: number,
  height: number,
): Camera {
  const extent = Math.max(
    100,
    ...points.flatMap((p) => [Math.abs(p.x) * 2, Math.abs(p.y) * 2]),
  );
  return {
    x: 0,
    y: 0,
    k: Math.max(0.08, Math.min(1, (Math.min(width, height) - 140) / extent)),
  };
}
