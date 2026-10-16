import { it, expect } from 'vitest';
import nodes from '../fixtures/demo-nodes.json';
import edges from '../fixtures/relationships.json';
import refs from '../fixtures/references.json';
import { buildDataset } from '../../scripts/lib/exports';
import { buildMapSnapshot } from '../../scripts/lib/map-snapshot';
import { validateRecords } from '../../scripts/lib/validation';
const dataset = () =>
  buildDataset(
    structuredClone(nodes) as any,
    refs,
    '2026-10-13T00:00:00Z',
    edges as any,
  );
it('projects one untyped node/link shape without changing source records', () => {
  const d = dataset(),
    before = JSON.stringify(d),
    s = buildMapSnapshot(d, true);
  expect(s.nodes).toHaveLength(5);
  expect(s.links).toHaveLength(3);
  expect(s.demo).toBe(true);
  expect(s.nodes[0]).not.toHaveProperty('kind');
  expect(s.nodes[0]).not.toHaveProperty('categories');
  expect(s.links[0]).not.toHaveProperty('types');
  expect(s.links[0]).not.toHaveProperty('forms');
  expect(s.nodes.find((n) => n.id === 'online-reading')!.locations).toEqual([]);
  expect(JSON.stringify(d)).toBe(before);
});
it('permits unclassified editorial records and only publishes explicitly approved interviews', () => {
  const d = dataset(),
    o = d.organizations.find((n) => n.id === 'example-collective')!;
  o.categories = [];
  expect(validateRecords([o], refs, '2026-10-13')).toEqual([]);
  const interview = {
    excerpt: { en: 'A fictional public interview excerpt.', zh: null },
    date: '2026-10-12',
    attribution: 'Example Collective',
    source_url: o.sources[0].url,
    publication_permission: true,
  };
  Object.assign(o, { profile_basis: 'both', interview });
  o.sources[0].kind = 'organization_statement';
  o.sources[0].reuse_basis = 'permission';
  o.sources[0].license_note = 'Fictional publication permission for tests.';
  expect(validateRecords([o], refs, '2026-10-13')).toEqual([]);
  expect(
    buildMapSnapshot(d, true).nodes.find((n) => n.id === o.id)?.basis,
  ).toBe('both');
  (o as any).interview.publication_permission = false;
  expect(validateRecords([o], refs, '2026-10-13').length).toBeGreaterThan(0);
});
it('does not infer interview provenance from an organization statement', () => {
  const d = dataset();
  d.organizations[0].sources[0].kind = 'organization_statement';
  expect(buildMapSnapshot(d, true).nodes[0].basis).toBe('public_information');
});
