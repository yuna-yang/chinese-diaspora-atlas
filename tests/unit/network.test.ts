import { it, expect } from 'vitest';
import nodes from '../fixtures/demo-nodes.json';
import edges from '../fixtures/relationships.json';
import refs from '../fixtures/references.json';
import { buildDataset } from '../../scripts/lib/exports';
import { parseAtlasState } from '../../website/src/features/atlas/state';
import { filterOrganizations } from '../../website/src/features/atlas/search';
import {
  filterRelationships,
  contextNodes,
  resolveRelationshipAnchors,
} from '../../website/src/features/network/network';
const d = buildDataset(
  nodes as any,
  refs,
  '2026-10-12T00:00:00Z',
  edges as any,
);
const state = () => parseAtlasState(new URLSearchParams(), refs);
it('defaults to primary nodes while relation filters never hide unconnected primary nodes', () => {
  expect(
    filterOrganizations(d, state()).every((o) => o.kind === 'primary'),
  ).toBe(true);
  expect(
    filterOrganizations(d, state()).some((o) => o.id === 'online-reading'),
  ).toBe(true);
  expect(
    filterOrganizations(d, { ...state(), kind: 'institution' }).map(
      (o) => o.id,
    ),
  ).toEqual(['civic-library']);
});
it('filters unclassified and overlapping characteristics separately', () => {
  expect(
    filterRelationships(d, {
      ...state(),
      relationshipTypes: ['unclassified'],
    }).map((e) => e.id),
  ).toEqual(['rainbow-cooperation']);
  expect(
    filterRelationships(d, {
      ...state(),
      relationshipTypes: ['linking'],
      periodStatuses: ['current'],
    }).map((e) => e.id),
  ).toEqual(['library-space']);
});
it('exposes cross-filter primary partners without changing directory counts', () => {
  const visible = filterOrganizations(d, { ...state(), country: 'DK' });
  const context = contextNodes(
    d,
    visible,
    'example-collective',
    filterRelationships(d, state()),
  );
  expect(visible.some((o) => o.id === 'lantern-room')).toBe(false);
  expect(context.some((o) => o.id === 'lantern-room')).toBe(true);
});
it('does not invent lines for ambiguous or online endpoints', () => {
  const edge = d.relationships.find((e) => e.id === 'reading-collaboration')!;
  expect(resolveRelationshipAnchors(edge, d.organizations, refs)).toEqual({
    sourceCityId: 'demo-city',
    targetCityId: 'demo-berlin',
  });
  const ambiguous = d.organizations.map((o) =>
    o.id === 'example-collective'
      ? {
          ...o,
          locations: [
            { city_id: 'demo-city', country_code: 'DK' },
            { city_id: 'demo-berlin', country_code: 'DE' },
          ],
        }
      : o,
  );
  expect(resolveRelationshipAnchors(edge, ambiguous, refs)).toBeNull();
});
