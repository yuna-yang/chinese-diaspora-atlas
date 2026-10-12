import { it, expect } from 'vitest';
import records from '../fixtures/organizations.json';
import refs from '../fixtures/references.json';
import { buildMarkers } from '../../website/src/features/atlas/markers';
it('creates a marker per city but never for online or country-only entries', () => {
  const a = {
    ...records[0],
    locations: [
      { city_id: 'demo-city', country_code: 'DK' },
      { city_id: 'demo-berlin', country_code: 'DE' },
    ],
  } as any;
  expect(buildMarkers([a], refs)).toHaveLength(2);
  expect(
    buildMarkers([{ ...a, online_only: true, locations: [] }], refs),
  ).toHaveLength(0);
  expect(
    buildMarkers(
      [{ ...a, locations: [{ city_id: null, country_code: 'DK' }] }],
      refs,
    ),
  ).toHaveLength(0);
});
