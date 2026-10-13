import type { Point } from './contracts';
export function seedPositions(nodes: { id: string }[]): Point[] {
  return [...nodes]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((n, i) => ({
      id: n.id,
      x: Math.cos(i * 2.399963229728653) * Math.sqrt(i + 0.5) * 55,
      y: Math.sin(i * 2.399963229728653) * Math.sqrt(i + 0.5) * 55,
    }));
}
