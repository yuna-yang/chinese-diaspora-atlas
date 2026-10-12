import { rm } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('website/out');
for (const locale of ['en', 'zh-CN'])
  for (const suffix of ['', '.txt', '.html']) {
    const target = path.resolve(
      root,
      locale,
      'organizations',
      '__empty__' + suffix,
    );
    if (!target.startsWith(root + path.sep))
      throw new Error('Unsafe placeholder path');
    await rm(target, { force: true, recursive: suffix === '' });
  }
