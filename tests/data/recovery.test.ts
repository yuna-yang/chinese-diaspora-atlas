import { it, expect } from 'vitest';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  copyFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import nodes from '../fixtures/organizations.json';
import refs from '../fixtures/references.json';
it('preserves valid outputs on invalid input and rebuilds deletions without old joins', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'atlas-recovery-'));
  const script = path.resolve('scripts/build-data.ts');
  const loader = path.resolve('node_modules/tsx/dist/cli.mjs');
  try {
    for (const dir of [
      'data/organizations',
      'data/relationships',
      'data/reference',
    ])
      mkdirSync(path.join(root, dir), { recursive: true });
    for (const key of ['categories', 'countries', 'cities'] as const)
      writeFileSync(
        path.join(root, 'data/reference', key + '.json'),
        JSON.stringify(refs[key]),
      );
    for (const file of [
      'duplicate-decisions.json',
      'relationship-duplicate-decisions.json',
    ])
      writeFileSync(path.join(root, 'data', file), '[]');
    copyFileSync('LICENSE-DATA', path.join(root, 'LICENSE-DATA'));
    const file = path.join(root, 'data/organizations/example-collective.json');
    writeFileSync(file, JSON.stringify(nodes[0]));
    const run = () =>
      spawnSync(process.execPath, [loader, script], {
        cwd: root,
        encoding: 'utf8',
        env: { ...process.env, ATLAS_DEMO: '0' },
      });
    expect(run().status).toBe(0);
    const output = path.join(root, 'website/public/data/atlas.json'),
      previous = readFileSync(output, 'utf8');
    writeFileSync(file, JSON.stringify({ ...nodes[0], id: 'wrong-id' }));
    expect(run().status).toBe(1);
    expect(readFileSync(output, 'utf8')).toBe(previous);
    rmSync(file);
    expect(run().status).toBe(0);
    expect(JSON.parse(readFileSync(output, 'utf8')).organizations).toEqual([]);
    expect(
      readFileSync(
        path.join(root, 'website/public/data/organizations.csv'),
        'utf8',
      ),
    ).not.toContain('example-collective');
  } finally {
    const resolved = path.resolve(root);
    if (
      !resolved.startsWith(path.resolve(tmpdir()) + path.sep) ||
      !path.basename(resolved).startsWith('atlas-recovery-')
    )
      throw new Error('Unsafe temporary cleanup');
    rmSync(resolved, { recursive: true, force: true });
  }
}, 15000);
