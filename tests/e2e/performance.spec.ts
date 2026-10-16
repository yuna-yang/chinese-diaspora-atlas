import { test, expect } from './test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('2000-node compact snapshot and worker remain usable on a throttled browser', async ({
  page,
  request,
}) => {
  test.setTimeout(90000);
  const d = await (await request.get(`${base}/data/map.json`)).json();
  const sample = d.nodes[0];
  d.nodes = Array.from({ length: 2000 }, (_, i) => ({
    ...sample,
    id: `synthetic-${i}`,
    names: { en: `Synthetic community ${i}`, zh: `虚构社群 ${i}` },
  }));
  d.links = Array.from({ length: 100 }, (_, i) => ({
    ...d.links[0],
    id: `edge-${i}`,
    sourceId: `synthetic-${i}`,
    targetId: `synthetic-${i + 1}`,
  }));
  d.datasetVersion = 'synthetic-2000';
  const body = JSON.stringify(d);
  await page.route('**/data/map.json', (r) =>
    r.fulfill({ contentType: 'application/json', body }),
  );
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: 1600000 / 8,
    uploadThroughput: 750000 / 8,
  });
  const start = Date.now();
  await page.goto(`${base}/en/?view=gather`);
  await expect(page.locator('.graph-star')).toHaveCount(2000, {
    timeout: 60000,
  });
  await page.waitForTimeout(800);
  const readyMs = Date.now() - start;
  await page
    .getByRole('button', { name: 'Choose a star', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  const chosen = page
    .locator('.star-picker')
    .getByRole('button', { name: 'Synthetic community 1999', exact: true });
  const activate = Date.now();
  await chosen.click();
  await expect(page.locator('.profile-panel')).toContainText(
    'Synthetic community 1999',
  );
  const activationMs = Date.now() - activate;
  const evidence = {
    nodes: 2000,
    links: 100,
    cpuSlowdown: 4,
    downloadMbps: 1.6,
    latencyMs: 150,
    compactBytes: Buffer.byteLength(body),
    gzipBytes: gzipSync(body).length,
    readyMs,
    activationMs,
  };
  mkdirSync('test-results', { recursive: true });
  writeFileSync(
    'test-results/performance.json',
    JSON.stringify(evidence, null, 2),
  );
  console.log('Synthetic minimal performance: ' + JSON.stringify(evidence));
  expect(Buffer.byteLength(body)).toBeLessThan(2 * 1024 * 1024);
  expect(activationMs).toBeLessThan(3000);
});
