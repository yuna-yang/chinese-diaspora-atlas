import { spawnSync } from 'node:child_process';
const command = process.argv[2];
if (command !== 'build' && command !== 'dev')
  throw new Error('Expected build or dev');
// Explicit local/demo mode: never writes fixture records into canonical production data.
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run through npm');
const result = spawnSync(process.execPath, [npmCli, 'run', command], {
  stdio: 'inherit',
  env: { ...process.env, ATLAS_DEMO: '1', NEXT_PUBLIC_DEMO: '1' },
});
process.exitCode = result.status ?? 1;
