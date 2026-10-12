import { it, expect } from 'vitest';
import refs from '../fixtures/references.json';
import {
  parseAtlasState,
  serializeAtlasState,
} from '../../website/src/features/atlas/state';
it('roundtrips network filters and selections without location coordinates', () => {
  const p = new URLSearchParams(
    'kind=institution&institution=culture&relation_type=bridging&period_status=current&node=civic-library&relationship=library-space&latitude=55',
  );
  const state = parseAtlasState(p, refs);
  expect(state.kind).toBe('institution');
  expect(state.relationshipTypes).toEqual(['bridging']);
  expect(serializeAtlasState(state).toString()).toBe(
    'kind=institution&institution=culture&relation_type=bridging&period_status=current&node=civic-library&relationship=library-space',
  );
});
it('normalizes unknown network values and invalid identifiers', () => {
  const s = parseAtlasState(
    new URLSearchParams(
      'kind=bad&institution=bad&relation_type=bad&node=../bad',
    ),
    refs,
  );
  expect(s.kind).toBe('primary');
  expect(s.institution).toBeNull();
  expect(s.relationshipTypes).toHaveLength(4);
  expect(s.selectedNodeId).toBeNull();
});
