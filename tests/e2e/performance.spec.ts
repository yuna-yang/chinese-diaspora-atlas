import { test, expect } from './test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('measures a synthetic 2000-node atlas under the proposed slow-device profile', async ({
  page,
  request,
  browserName,
}) => {
  test.setTimeout(60000);
  const d = await (await request.get(`${base}/data/atlas.json`)).json();
  const original = d.organizations.find(
    (o: { kind: string }) => o.kind === 'primary',
  );
  d.organizations = Array.from({ length: 2000 }, (_, i) => ({
    ...original,
    id: 'synthetic-' + i,
    names: { en: 'Synthetic community ' + i, zh: '虚构社群 ' + i },
    locations:
      i % 3 === 0
        ? [
            { city_id: 'demo-city', country_code: 'DK' },
            { city_id: 'demo-berlin', country_code: 'DE' },
          ]
        : [
            {
              city_id: i % 2 ? 'demo-city' : 'demo-berlin',
              country_code: i % 2 ? 'DK' : 'DE',
            },
          ],
  }));
  d.relationships = Array.from({ length: 100 }, (_, i) => ({
    ...d.relationships[0],
    id: 'synthetic-edge-' + i,
    source_id: 'synthetic-' + i,
    target_id: 'synthetic-' + (i + 1),
    source_city_id: null,
    target_city_id: null,
    direction: 'undirected',
  }));
  const json = JSON.stringify(d);
  await page.route('**/data/atlas.json', (r) =>
    r.fulfill({ contentType: 'application/json', body: json }),
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
  await page.addInitScript(() => {
    (window as any).__atlasMetrics = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        (window as any).__atlasMetrics.lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any)
        if (!entry.hadRecentInput)
          (window as any).__atlasMetrics.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(`${base}/en/`);
  await expect(page.locator('.directory-list .organization-card')).toHaveCount(
    20,
  );
  await expect(page.locator('.map-pin').first()).toBeVisible();
  await page.evaluate(() => {
    const input = document.querySelector('input[type=search]')!;
    input.addEventListener('input', () => {
      (window as any).__searchStarted = performance.now();
    });
    const observer = new MutationObserver(() => {
      const cards = document.querySelectorAll(
        '.directory-list .organization-card',
      );
      if (
        cards.length === 1 &&
        cards[0].textContent?.includes('Synthetic community 1999')
      ) {
        (window as any).__searchRendered = performance.now();
        observer.disconnect();
      }
    });
    observer.observe(document.querySelector('.directory-list')!, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  });
  const start = Date.now();
  await page.getByRole('searchbox').fill('Synthetic community 1999');
  await expect(page.locator('.directory-list .organization-card')).toHaveCount(
    1,
  );
  const elapsed = Date.now() - start;
  const metrics = await page.evaluate(() => (window as any).__atlasMetrics);
  const result = {
    browser: browserName,
    cpuSlowdown: 4,
    downloadMbps: 1.6,
    uploadKbps: 750,
    latencyMs: 150,
    coldCache: true,
    nodes: 2000,
    relationships: 100,
    datasetBytes: Buffer.byteLength(json),
    datasetGzipBytes: gzipSync(json).length,
    searchIncludingDebounceMs: elapsed,
    searchRenderIncludingDebounceMs: await page.evaluate(
      () => (window as any).__searchRendered - (window as any).__searchStarted,
    ),
    ...metrics,
  };
  mkdirSync('test-results', { recursive: true });
  writeFileSync(
    'test-results/performance.json',
    JSON.stringify(result, null, 2),
  );
  console.log('Synthetic performance evidence: ' + JSON.stringify(result));
  expect(metrics.cls).toBeLessThanOrEqual(0.1);
  expect(elapsed).toBeLessThan(1000);
});
