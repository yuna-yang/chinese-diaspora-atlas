import { it, expect } from 'vitest';
import Supercluster from 'supercluster';
import {
  viewportClusters,
  visibleLongitudes,
} from '../../website/src/features/minimal/geo-clusters';
it('keeps a visible star across the antimeridian and on a wrapped full-world viewport', () => {
  const index = new Supercluster<{ id: string }>().load([
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-170, 0] },
      properties: { id: 'pacific' },
    },
  ]);
  expect(
    viewportClusters(index, { west: 150, south: -20, east: 230, north: 20 }, 4),
  ).toHaveLength(1);
  expect(
    viewportClusters(index, { west: 250, south: -20, east: 620, north: 20 }, 2),
  ).toHaveLength(1);
});

it('places stars in every visible wrapped world copy', () => {
  expect(visibleLongitudes(-170, 150, 230)).toEqual([190]);
  expect(visibleLongitudes(-170, -200, 200)).toEqual([-170, 190]);
});
