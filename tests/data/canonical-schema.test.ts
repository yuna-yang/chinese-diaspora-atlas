import { it, expect, vi } from 'vitest';
import records from '../fixtures/organizations.json';
import refs from '../fixtures/references.json';
vi.mock('../../scripts/lib/schema.generated', async () => {
  const { default: schema } =
    await import('../../data/schema/organization.schema.json');
  return { default: { ...schema, additionalProperties: true } };
});
import { validateRecords } from '../../scripts/lib/validation';
it('uses canonical schema even when generated type schema is stale', () => {
  const invalid = {
    ...records[0],
    private_address: 'must never pass publication validation',
  };
  expect(validateRecords([invalid], refs, '2026-10-12').length).toBeGreaterThan(
    0,
  );
});
