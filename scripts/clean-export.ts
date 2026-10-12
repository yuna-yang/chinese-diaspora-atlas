import { rm } from 'node:fs/promises';
import path from 'node:path';
const target = path.resolve('website/out');
if (!target.startsWith(path.resolve('website') + path.sep))
  throw new Error('Unsafe export path');
await rm(target, { recursive: true, force: true });
