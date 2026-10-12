import { it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
it('builds joined node/edge exports with one version and synthetic attribution', () => {
  const result = spawnSync(
    process.execPath,
    ['node_modules/tsx/dist/cli.mjs', 'scripts/build-data.ts'],
    {
      cwd: process.cwd(),
      env: { ...process.env, ATLAS_DEMO: '1' },
      encoding: 'utf8',
    },
  );
  expect(result.status, result.stderr).toBe(0);
  const atlas = JSON.parse(
      readFileSync('website/public/data/atlas.json', 'utf8'),
    ),
    nodes = JSON.parse(
      readFileSync('website/public/data/organizations.json', 'utf8'),
    ),
    edges = JSON.parse(
      readFileSync('website/public/data/relationships.json', 'utf8'),
    );
  expect(atlas.relationships).toHaveLength(3);
  expect(nodes.relationships).toBeUndefined();
  expect([nodes.dataset_version, edges.dataset_version]).toEqual([
    atlas.dataset_version,
    atlas.dataset_version,
  ]);
  expect(atlas.attribution).toContain('SYNTHETIC');
  expect(atlas.organizations.some((n: any) => n.kind === 'institution')).toBe(
    true,
  );
}, 15000);
