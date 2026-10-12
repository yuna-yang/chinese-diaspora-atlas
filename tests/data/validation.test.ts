import { describe, it, expect } from 'vitest';
import records from '../fixtures/organizations.json';
import refs from '../fixtures/references.json';
import { validateRecords } from '../../scripts/lib/validation';
const today = '2026-10-12';
describe('publication validation', () => {
  it('accepts a sourced record and rejects missing identity', () => {
    expect(validateRecords(records, refs, today)).toEqual([]);
    const bad = structuredClone(records);
    bad[0].names = { zh: null, en: null } as never;
    expect(validateRecords(bad, refs, today).length).toBeGreaterThan(0);
  });
  it.each([
    'unknown',
    'future',
    'calendar',
    'city',
    'url',
    'evidence',
    'precise',
    'online',
    'license',
    'blank',
    'duplicate',
  ])('rejects %s data', (kind) => {
    const bad = structuredClone(records) as any[];
    switch (kind) {
      case 'unknown':
        bad[0].secret = 'x';
        break;
      case 'future':
        bad[0].last_verified = '2027-01-01';
        break;
      case 'calendar':
        bad[0].updated_at = '2026-02-30';
        break;
      case 'city':
        bad[0].locations[0].country_code = 'DE';
        break;
      case 'url':
        bad[0].links[0].url = 'javascript:alert(1)';
        break;
      case 'evidence':
        bad[0].sources = [];
        break;
      case 'precise':
        bad[0].coordinates = [1, 2];
        break;
      case 'online':
        bad[0].online_only = true;
        break;
      case 'license':
        bad[0].sources[0].reuse_basis = 'permission';
        break;
      case 'blank':
        bad[0].names.en = '  ';
        break;
      case 'duplicate':
        bad.push(structuredClone(bad[0]));
    }
    expect(validateRecords(bad, refs, today).length).toBeGreaterThan(0);
  });
  it('requires evidence for positive classifications', () => {
    const bad = structuredClone(records) as any[];
    bad[0].affiliation.kind = 'independent';
    bad[0].activity_status = 'active';
    expect(validateRecords(bad, refs, today).length).toBeGreaterThan(0);
  });
});
