import { it, expect } from 'vitest';
import records from '../fixtures/organizations.json';
import refs from '../fixtures/references.json';
import { validateRecords } from '../../scripts/lib/validation';
const v2 = () => ({
  ...structuredClone(records[0]),
  schema_version: 2,
  kind: 'primary',
  institution_type: null,
  founded_year: null,
  reach: null,
  public_contacts: [],
  information_basis: 'public_documentation',
});
it('accepts migrated primary data and rejects legacy schema', () => {
  expect(validateRecords([v2()], refs, '2026-10-12')).toEqual([]);
  expect(
    validateRecords([{ ...v2(), schema_version: 1 }], refs, '2026-10-12')
      .length,
  ).toBeGreaterThan(0);
});
it('permits connected-institution identity without inventing diaspora scope', () => {
  const node = {
    ...v2(),
    kind: 'institution',
    institution_type: 'culture',
    categories: [],
    sources: [{ ...records[0].sources[0], supports: ['identity', 'location'] }],
  };
  expect(validateRecords([node], refs, '2026-10-12')).toEqual([]);
});
it('requires founding reach and contact claims to have specific evidence', () => {
  const node = {
    ...v2(),
    founded_year: 2021,
    reach: {
      scope: 'transnational',
      summary: { en: 'International network', zh: null },
      source_urls: ['https://example.org/about'],
    },
    public_contacts: [
      {
        kind: 'role_email',
        value: 'info@example.org',
        source_url: 'https://example.org/about',
      },
    ],
  };
  expect(validateRecords([node], refs, '2026-10-12').length).toBeGreaterThan(0);
});
