import { it, expect } from 'vitest';
import {
  layoutGraph,
  seedPositions,
} from '../../website/src/features/minimal/graph-layout';
import {
  zoomAt,
  screenToWorld,
} from '../../website/src/features/minimal/camera';
it('lays out isolated nodes deterministically and does not mutate source', () => {
  const nodes = [{ id: 'one' }, { id: 'two' }, { id: 'isolated' }],
    links = [
      { sourceId: 'one', targetId: 'two' },
      { sourceId: 'missing', targetId: 'two' },
    ],
    before = JSON.stringify({ nodes, links });
  const p = layoutGraph(nodes, links);
  expect(p).toEqual(layoutGraph(nodes, links));
  expect(p).toHaveLength(3);
  expect(p.every((n) => Number.isFinite(n.x) && Number.isFinite(n.y))).toBe(
    true,
  );
  expect(JSON.stringify({ nodes, links })).toBe(before);
  expect(seedPositions([])).toEqual([]);
});
it('keeps the pointer world position fixed when zooming', () => {
  const c = { x: 20, y: -30, k: 0.8 },
    point = { x: 100, y: 90 };
  const before = screenToWorld(point, c);
  expect(screenToWorld(point, zoomAt(c, point, 1.5))).toEqual(before);
});
