import { it, expect } from 'vitest';
import edges from '../fixtures/relationships.json';
import {
  edgePresentation,
  visibleEdges,
} from '../../website/src/features/network/edge-presentation';
import type { Relationship } from '../../scripts/lib/contracts';
it('uses patterns as well as color for characteristics', () => {
  const e = edges[0] as Relationship;
  expect(edgePresentation({ ...e, types: ['bonding'] }).dashArray).not.toBe(
    edgePresentation({ ...e, types: ['bridging'] }).dashArray,
  );
  expect(edgePresentation({ ...e, types: ['linking'] }).dashArray).not.toBe(
    edgePresentation({ ...e, types: [] }).dashArray,
  );
  expect(
    edgePresentation({ ...e, temporal_status: 'past' }).opacity,
  ).toBeLessThan(
    edgePresentation({ ...e, temporal_status: 'current' }).opacity,
  );
});
it('simplifies crowded scales while preserving a selected edge', () => {
  const list = Array.from({ length: 250 }, (_, i) => ({
    ...edges[0],
    id: 'edge-' + i,
  })) as Relationship[];
  expect(visibleEdges(list, 2, null)).toHaveLength(0);
  expect(visibleEdges(list, 2, 'edge-249').map((e) => e.id)).toEqual([
    'edge-249',
  ]);
  expect(visibleEdges(list, 6, 'edge-249')).toHaveLength(200);
  expect(visibleEdges(list, 6, 'edge-249')[0].id).toBe('edge-249');
});
