import { it, expect } from 'vitest';
import records from '../fixtures/organizations.json';
import refs from '../fixtures/references.json';
import { buildDataset, serializeCsv } from '../../scripts/lib/exports';
import { computeStatistics } from '../../scripts/lib/statistics';
it('sorts canonically and hashes content rather than generation time', () => {
  const a = records[0] as any;
  const b = { ...a, id: 'another' };
  const x = buildDataset([a, b], refs, '2026-10-12T00:00:00Z');
  const y = buildDataset([b, a], refs, '2026-10-13T00:00:00Z');
  expect(x.organizations.map((o) => o.id)).toEqual([
    'another',
    'example-collective',
  ]);
  expect(x.dataset_version).toBe(y.dataset_version);
  expect(x.reference_data.cities).toHaveLength(2);
});
it('neutralizes formula strings and quotes bilingual multiline CSV', () => {
  const a = structuredClone(records[0]) as any;
  a.names.en = '=HYPERLINK("evil")';
  a.descriptions.zh = '中文\n"引号"';
  const csv = serializeCsv(buildDataset([a], refs, '2026-10-12T00:00:00Z'));
  expect(csv.startsWith('\uFEFFid,')).toBe(true);
  expect(csv).toContain("'=HYPERLINK");
  expect(csv).toContain('中文\n""引号""');
  expect(csv.split('\r\n')[0].split(',')).toHaveLength(19);
});
it('counts organizations rather than markers and retains inactive records', () => {
  const a = {
    ...records[0],
    locations: [
      { city_id: 'demo-city', country_code: 'DK' },
      { city_id: 'demo-berlin', country_code: 'DE' },
    ],
    categories: ['community_culture', 'media'],
    activity_status: 'inactive',
  } as any;
  const d = buildDataset([a], refs, '2026-10-12T00:00:00Z');
  const s = computeStatistics(d, '2026-10-12');
  expect(s.total).toBe(1);
  expect(s.byCountry).toEqual({ DK: 1, DE: 1 });
  expect(s.byCategory).toEqual({ community_culture: 1, media: 1 });
  expect(s.byActivity.inactive).toBe(1);
  expect(serializeCsv(d)).toContain('inactive');
});
