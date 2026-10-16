import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
  type SimulationNodeDatum,
} from 'd3-force';
import type { Point } from './contracts';
import { seedPositions } from './graph-seed';
export { seedPositions } from './graph-seed';
export function layoutGraph(
  input: { id: string }[],
  edges: { sourceId: string; targetId: string }[],
): Point[] {
  const nodes = seedPositions(input) as (Point & SimulationNodeDatum)[],
    ids = new Set(nodes.map((n) => n.id));
  const links = edges
    .filter(
      (e) =>
        e.sourceId !== e.targetId && ids.has(e.sourceId) && ids.has(e.targetId),
    )
    .map((e) => ({ source: e.sourceId, target: e.targetId }));
  const sim = forceSimulation(nodes)
    .stop()
    .force('charge', forceManyBody().strength(-110))
    .force('center', forceCenter(0, 0))
    .force('collision', forceCollide(28))
    .force(
      'link',
      forceLink<Point & SimulationNodeDatum, (typeof links)[number]>(links)
        .id((n) => n.id)
        .distance(130)
        .strength(0.12),
    );
  sim.tick(120);
  return nodes.map((n) => ({ id: n.id, x: n.x, y: n.y }));
}
