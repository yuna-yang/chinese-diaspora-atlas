import { mkdir, writeFile, rename, rm, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { loadInput, requireValid } from './lib/input';
import {
  buildDataset,
  serializeCsv,
  serializeRelationshipsCsv,
} from './lib/exports';
import { computeStatistics } from './lib/statistics';
import { buildMapSnapshot } from './lib/map-snapshot';
const demo = process.env.ATLAS_DEMO === '1';
const { records, refs, relationships } = await loadInput(demo);
const generated = new Date().toISOString();
requireValid(records, refs, generated.slice(0, 10), relationships);
const dataset = buildDataset(
  records,
  refs,
  generated,
  relationships,
  demo
    ? {
        license: 'CC BY 4.0 — synthetic examples only',
        attribution:
          'SYNTHETIC DEMONSTRATION ONLY — not verified organizations.',
      }
    : undefined,
);
const root = path.resolve('website/public');
await mkdir(root, { recursive: true });
const tmp = path.join(root, `.data-${randomUUID()}`),
  old = path.join(root, `.data-old-${randomUUID()}`),
  target = path.join(root, 'data');
await mkdir(tmp);
try {
  await Promise.all([
    copyFile('LICENSE-DATA', path.join(tmp, 'LICENSE-DATA')),
    writeFile(
      path.join(tmp, 'map.json'),
      JSON.stringify(buildMapSnapshot(dataset, demo)) + '\n',
    ),
    writeFile(
      path.join(tmp, 'atlas.json'),
      JSON.stringify(dataset, null, 2) + '\n',
    ),
    writeFile(
      path.join(tmp, 'organizations.json'),
      JSON.stringify({ ...dataset, relationships: undefined }, null, 2) + '\n',
    ),
    writeFile(path.join(tmp, 'organizations.csv'), serializeCsv(dataset)),
    writeFile(
      path.join(tmp, 'relationships.json'),
      JSON.stringify(
        {
          schema_version: 1,
          dataset_version: dataset.dataset_version,
          generated_at: generated,
          license: dataset.license,
          attribution: dataset.attribution,
          relationships: dataset.relationships,
        },
        null,
        2,
      ) + '\n',
    ),
    writeFile(
      path.join(tmp, 'relationships.csv'),
      serializeRelationshipsCsv(dataset),
    ),
    writeFile(
      path.join(tmp, 'statistics.json'),
      JSON.stringify(
        computeStatistics(dataset, generated.slice(0, 10)),
        null,
        2,
      ) + '\n',
    ),
  ]);
  let previous = false;
  try {
    await rename(target, old);
    previous = true;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
  }
  try {
    await rename(tmp, target);
  } catch (e) {
    if (previous) await rename(old, target);
    throw e;
  }
  if (previous) await rm(old, { recursive: true, force: true });
  console.log(
    `${demo ? 'DEMO' : 'Reviewed'} dataset: ${records.length} records, ${dataset.dataset_version.slice(0, 12)}`,
  );
} finally {
  await rm(tmp, { recursive: true, force: true });
}
