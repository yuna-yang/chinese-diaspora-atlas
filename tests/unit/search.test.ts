import { it, expect } from 'vitest';
import records from '../fixtures/organizations.json';
import refs from '../fixtures/references.json';
import { buildDataset } from '../../scripts/lib/exports';
import { filterOrganizations } from '../../website/src/features/atlas/search';
import {
  parseAtlasState,
  serializeAtlasState,
} from '../../website/src/features/atlas/state';
const d = buildDataset(records as any, refs, '2026-10-12T00:00:00Z');
const defaults = () => parseAtlasState(new URLSearchParams(), refs);
it('searches both languages with full-width normalization and token AND', () => {
  expect(
    filterOrganizations(d, { ...defaults(), q: 'ＥＸＡＭＰＬＥ Copenhagen' }),
  ).toHaveLength(1);
  expect(
    filterOrganizations(d, { ...defaults(), q: '示例 missing' }),
  ).toHaveLength(0);
});
it('requires country and city to match the same branch', () => {
  const a = {
    ...records[0],
    locations: [
      { country_code: 'DK', city_id: 'demo-city' },
      { country_code: 'DE', city_id: 'demo-berlin' },
    ],
  } as any;
  expect(
    filterOrganizations(
      { ...d, organizations: [a] },
      { ...defaults(), country: 'DK', city: 'demo-berlin' },
    ),
  ).toEqual([]);
});
it('uses category OR and status defaults', () => {
  expect(
    filterOrganizations(d, {
      ...defaults(),
      categories: ['media', 'community_culture'],
    }),
  ).toHaveLength(1);
  expect(
    filterOrganizations(
      {
        ...d,
        organizations: [{ ...d.organizations[0], activity_status: 'inactive' }],
      },
      defaults(),
    ),
  ).toHaveLength(0);
});
it('normalizes conflicting URLs and preserves all statuses in share state', () => {
  const x = parseAtlasState(new URLSearchParams('city=demo-city'), refs);
  expect(x.country).toBe('DK');
  expect(
    parseAtlasState(
      new URLSearchParams('online=1&country=DK&city=demo-city&page=-4'),
      refs,
    ),
  ).toMatchObject({ onlineOnly: true, country: null, city: null, page: 1 });
  expect(
    serializeAtlasState({
      ...x,
      statuses: ['unknown', 'inactive', 'active'],
    }).getAll('status'),
  ).toEqual(['active', 'inactive', 'unknown']);
});
