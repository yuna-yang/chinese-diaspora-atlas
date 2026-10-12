import { it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
it('explains actual launch gates instead of reporting completed features as absent', () => {
  const result = spawnSync(
    process.execPath,
    ['--import', 'tsx', 'scripts/check-release.ts'],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        ATLAS_DEMO: '0',
        NEXT_PUBLIC_DEMO: '0',
        NEXT_PUBLIC_REMOVAL_URL: 'mailto:placeholder@example.invalid',
        NEXT_PUBLIC_EDITORIAL_URL: 'mailto:placeholder@example.invalid',
      },
    },
  );
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Editorial');
  expect(result.stderr).toContain('Human');
  expect(result.stderr).not.toContain('migration');
});
