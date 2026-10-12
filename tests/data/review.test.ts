import { it, expect } from 'vitest';
import records from '../fixtures/organizations.json';
import refs from '../fixtures/references.json';
import { reviewRecords } from '../../scripts/lib/review';
it('reports same-website duplicates and honors documented exceptions', () => {
  const a = records[0] as any;
  const b = {
    ...structuredClone(a),
    id: 'another',
    names: { zh: null, en: 'Another' },
  };
  expect(
    reviewRecords([a, b], refs, '2026-10-12', []).duplicatePairs[0].ids,
  ).toEqual(['another', 'example-collective']);
  expect(
    reviewRecords([a, b], refs, '2026-10-12', [
      {
        ids: ['another', 'example-collective'],
        reason: 'Independent branches',
      },
    ]).duplicatePairs,
  ).toEqual([]);
});
it('does not infer duplicates from a shared social host', () => {
  const a = structuredClone(records[0]) as any;
  a.links = [{ kind: 'social', url: 'https://social.example/a' }];
  const b = {
    ...structuredClone(a),
    id: 'another',
    names: { zh: null, en: 'Another' },
    links: [{ kind: 'social', url: 'https://social.example/b' }],
  };
  expect(reviewRecords([a, b], refs, '2026-10-12', []).duplicatePairs).toEqual(
    [],
  );
});
it('marks age 181 stale and age 180 fresh', () => {
  const a = { ...records[0], last_verified: '2026-04-15' } as any;
  const b = { ...records[0], id: 'older', last_verified: '2026-04-14' } as any;
  expect(reviewRecords([a, b], refs, '2026-10-12', []).staleIds).toEqual([
    'older',
  ]);
});
