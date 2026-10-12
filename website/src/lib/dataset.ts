import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Dataset, Statistics } from './contracts';
export async function loadDataset(): Promise<Dataset> {
  return JSON.parse(
    await readFile(path.join(process.cwd(), 'public/data/atlas.json'), 'utf8'),
  );
}
export async function loadStatistics(): Promise<Statistics> {
  return JSON.parse(
    await readFile(
      path.join(process.cwd(), 'public/data/statistics.json'),
      'utf8',
    ),
  );
}
