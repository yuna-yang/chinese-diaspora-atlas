import { it, expect } from 'vitest';
import records from '../fixtures/organizations.json';
import refs from '../fixtures/references.json';
import {
  validateRelationships,
  canonicalRelationship,
} from '../../scripts/lib/relationships';
const node = {
  ...records[0],
  schema_version: 2,
  kind: 'primary',
  institution_type: null,
  founded_year: null,
  reach: null,
  public_contacts: [],
  information_basis: 'public_documentation',
} as any;
const institution = {
  ...node,
  id: 'library',
  kind: 'institution',
  institution_type: 'culture',
  categories: [],
};
const edge: any = {
  schema_version: 1,
  id: 'library-support',
  source_id: 'library',
  target_id: node.id,
  direction: 'directed',
  types: ['linking', 'bridging'],
  forms: ['space_resources'],
  descriptions: { en: 'Synthetic public space partnership.', zh: null },
  classification_basis: {
    en: 'Cross-community access to institutional space.',
    zh: null,
  },
  period: { start: '2025', end: null, label: { en: 'Since 2025', zh: null } },
  temporal_status: 'current',
  source_city_id: 'demo-city',
  target_city_id: 'demo-city',
  sources: [
    {
      url: 'https://example.org/partnership',
      title: 'Synthetic evidence',
      accessed_at: '2026-10-12',
      supports: ['relationship', 'classification', 'period', 'direction'],
      reuse_basis: 'original_summary',
    },
  ],
  information_basis: 'public_documentation',
  last_verified: '2026-10-12',
  created_at: '2026-10-12',
  updated_at: '2026-10-12',
};
it('accepts evidenced directed multitype institutional cooperation', () => {
  expect(
    validateRelationships([edge], [node, institution], refs, '2026-10-12'),
  ).toEqual([]);
});
it.each([
  'dangling',
  'self',
  'classification',
  'direction',
  'date',
  'anchor',
  'future',
])('rejects %s graph claims', (kind) => {
  const bad = structuredClone(edge);
  switch (kind) {
    case 'dangling':
      bad.target_id = 'missing';
      break;
    case 'self':
      bad.target_id = bad.source_id;
      break;
    case 'classification':
      bad.sources[0].supports = ['relationship', 'period', 'direction'];
      break;
    case 'direction':
      bad.sources[0].supports = ['relationship', 'classification', 'period'];
      break;
    case 'date':
      bad.period = {
        start: '2025-10',
        end: '2024',
        label: { zh: null, en: null },
      };
      break;
    case 'anchor':
      bad.source_city_id = 'demo-berlin';
      break;
    case 'future':
      bad.period.start = '2027';
  }
  expect(
    validateRelationships([bad], [node, institution], refs, '2026-10-12')
      .length,
  ).toBeGreaterThan(0);
});
it('rejects orphan institutions and preserves undirected anchor identity when sorting', () => {
  expect(
    validateRelationships([], [node, institution], refs, '2026-10-12').length,
  ).toBeGreaterThan(0);
  const u = canonicalRelationship({
    ...edge,
    direction: 'undirected',
    source_city_id: 'demo-berlin',
    target_city_id: 'demo-city',
  });
  expect([u.source_id, u.source_city_id]).toEqual([
    'example-collective',
    'demo-city',
  ]);
});
