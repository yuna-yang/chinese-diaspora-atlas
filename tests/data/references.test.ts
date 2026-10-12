import { it, expect } from 'vitest';
import refs from '../fixtures/references.json';
import { validateRecords } from '../../scripts/lib/validation';
it.each([
  'latitude',
  'duplicate',
  'country',
  'label',
  'extra',
  'date',
  'permission',
  'url',
])('rejects malformed %s references even with no organizations', (kind) => {
  const bad = structuredClone(refs) as any;
  switch (kind) {
    case 'latitude':
      bad.cities[0].latitude = 100;
      break;
    case 'duplicate':
      bad.cities.push({ ...bad.cities[0], longitude: 9 });
      break;
    case 'country':
      bad.cities[0].country_code = 'XX';
      break;
    case 'label':
      delete bad.categories[0].labels.zh;
      break;
    case 'extra':
      bad.cities[0].street_address = 'not allowed';
      break;
    case 'date':
      bad.cities[0].source.accessed_at = '2027-01-01';
      break;
    case 'permission':
      bad.cities[0].source.reuse_basis = 'permission';
      break;
    case 'url':
      bad.cities[0].source.url = 'https://user:password@example.org/';
  }
  expect(validateRecords([], bad, '2026-10-12').length).toBeGreaterThan(0);
});
