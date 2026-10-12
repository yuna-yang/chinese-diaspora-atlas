import { it, expect } from 'vitest';
import { normalizeSelection } from '../../website/src/features/network/network';
import { parseAtlasState } from '../../website/src/features/atlas/state';
import { buildDataset } from '../../scripts/lib/exports';
import nodes from '../fixtures/demo-nodes.json';
import edges from '../fixtures/relationships.json';
import refs from '../fixtures/references.json';
const d = buildDataset(
  nodes as any,
  refs,
  '2026-10-12T00:00:00Z',
  edges as any,
);
it('drops unrelated, filtered-out and deleted selections consistently', () => {
  for (const query of [
    'node=lantern-room&relationship=library-space',
    'relation_type=bonding&relationship=library-space',
    'node=deleted&relationship=deleted',
  ]) {
    const state = parseAtlasState(new URLSearchParams(query), refs);
    expect(
      normalizeSelection(
        d,
        state,
        d.organizations.map((o) => o.id),
      ).selectedRelationshipId,
    ).toBeNull();
  }
  expect(
    normalizeSelection(
      d,
      parseAtlasState(new URLSearchParams('node=deleted'), refs),
      [],
    ).selectedNodeId,
  ).toBeNull();
});
it('retains an approved incident selection', () => {
  const state = parseAtlasState(
    new URLSearchParams('node=example-collective&relationship=library-space'),
    refs,
  );
  expect(normalizeSelection(d, state, []).selectedRelationshipId).toBe(
    'library-space',
  );
});
