import { test, expect } from './test';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('dragging a star does not select it; camera and positions survive locale and mode changes', async ({
  page,
}) => {
  await page.goto(`${base}/en/?view=gather`);
  const star = page.locator('.graph-star[data-node="example-collective"]');
  await expect(star).toBeVisible();
  await page.waitForTimeout(800);
  const r = (await star.boundingBox())!;
  await page.mouse.move(r.x + 22, r.y + 22);
  await page.mouse.down();
  await page.mouse.move(r.x + 122, r.y + 72, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator('.profile-panel')).toHaveCount(0);
  const moved = (await star.boundingBox())!;
  expect(moved.x - r.x).toBeGreaterThan(80);
  await page.getByRole('button', { name: /EN\/CN/ }).click();
  await expect(star).toHaveAttribute('aria-label', '示例社群');
  const translated = (await star.boundingBox())!;
  expect(Math.abs(translated.x - moved.x)).toBeLessThan(2);
  await page.getByRole('button', { name: '切换至散地图' }).click();
  await expect(page.locator('.geo-canvas')).toBeVisible();
  await page.getByRole('button', { name: '切换至聚星图' }).click();
  await expect(star).toBeVisible();
  await page.waitForTimeout(750);
  expect(Math.abs((await star.boundingBox())!.x - moved.x)).toBeLessThan(2);
  await star.click();
  await expect(page.locator('.profile-panel')).toBeVisible();
  await page.locator('.graph-canvas').click({ position: { x: 30, y: 250 } });
  await expect(page.locator('.profile-panel')).toHaveCount(0);
});
test('blank pan and zoom retain selection; a blank tap closes', async ({
  page,
}) => {
  await page.goto(`${base}/en/?view=gather&node=example-collective`);
  await expect(page.locator('.profile-panel')).toBeVisible();
  await page.mouse.move(100, 250);
  await page.mouse.down();
  await page.mouse.move(160, 280, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('.profile-panel')).toBeVisible();
  await page.mouse.wheel(0, 150);
  await expect(page.locator('.profile-panel')).toBeVisible();
  await page.locator('.profile-panel h1').click();
  await expect(page.locator('.profile-panel')).toBeVisible();
  await page.locator('.graph-canvas').click({ position: { x: 100, y: 250 } });
  await expect(page.locator('.profile-panel')).toHaveCount(0);
});
test('coincident stars remain selectable at maximum geographic zoom', async ({
  page,
}) => {
  await page.goto(`${base}/en/`);
  await expect(page.locator('.geo-star')).not.toHaveCount(0);
  for (let i = 0; i < 8; i++) {
    const cluster = page
      .locator('.geo-star')
      .filter({ has: page.locator('small') })
      .first();
    if (!(await cluster.count())) break;
    await cluster.click();
    await page.waitForTimeout(350);
  }
  await expect(page.locator('.star-picker')).toBeVisible();
  await page
    .locator('.star-picker')
    .getByRole('button', { name: 'Example Collective', exact: true })
    .click();
  await expect(page.locator('.profile-panel')).toContainText(
    'Example Collective',
  );
});
test('explicit interview evidence and online-only stars are available in gathered view', async ({
  page,
}) => {
  await page.goto(`${base}/en/?view=gather&node=lantern-room`);
  await expect(page.locator('.profile-panel')).toContainText(
    'Interview and public information',
  );
  await expect(page.locator('blockquote')).toContainText('fictional interview');
  await page.keyboard.press('Escape');
  await page.locator('.graph-star[data-node="online-reading"]').click();
  await expect(page.locator('.profile-panel')).toContainText(
    'Online community',
  );
});
test('keyboard picker opens stars and Escape restores usable focus', async ({
  page,
}) => {
  await page.goto(`${base}/en/`);
  await page.locator('.star-picker-trigger').focus();
  await page.keyboard.press('Enter');
  await page
    .locator('.star-picker')
    .getByRole('button', { name: 'Example Collective', exact: true })
    .click();
  await expect(page.locator('.profile-panel')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.atlas-title')).toBeFocused();
});
test('back navigation restores mode and selected star', async ({ page }) => {
  await page.goto(`${base}/en/?view=gather`);
  await page.locator('.graph-star[data-node="example-collective"]').click();
  await page.getByRole('button', { name: 'About', exact: true }).click();
  await page.goBack();
  await expect(page.locator('.profile-panel')).toBeVisible();
  await expect(page.locator('.graph-canvas')).toBeVisible();
});
test('empty data, failed snapshot and retry keep About available', async ({
  page,
  request,
}) => {
  const d = await (await request.get(`${base}/data/map.json`)).json();
  let fail = true;
  await page.route('**/data/map.json', (r) =>
    fail
      ? r.fulfill({ status: 503 })
      : r.fulfill({ json: { ...d, nodes: [], links: [] } }),
  );
  await page.goto(`${base}/en/`);
  await expect(page.getByRole('status')).toContainText('Unable to load');
  fail = false;
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(page.getByRole('status')).toContainText(
    'No reviewed communities',
  );
  await page.getByRole('button', { name: 'About', exact: true }).click();
  await expect(page.locator('.about-panel')).toBeVisible();
});
test('worker failure leaves deterministic stars usable with reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    window.Worker = class {
      constructor() {
        throw Error('blocked');
      }
    } as any;
  });
  await page.goto(`${base}/en/?view=gather`);
  await expect(page.locator('.graph-star')).toHaveCount(5);
  await page.locator('.graph-star[data-node="example-collective"]').click();
  await expect(page.locator('.profile-panel')).toBeVisible();
});
test('denied location, blocked storage and tiles still allow navigation', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw Error('blocked');
      },
    });
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition(_s: unknown, error: (e: { code: number }) => void) {
          error({ code: 1 });
        },
      },
    });
  });
  await page.route('https://tile.openstreetmap.org/**', (r) => r.abort());
  await page.goto(`${base}/en/`);
  await page
    .getByRole('button', { name: 'Use my location', exact: true })
    .click();
  await expect(page.getByRole('status')).toContainText('Location unavailable');
  await page.getByRole('button', { name: 'Switch to gathered view' }).click();
  await page.locator('.graph-star[data-node="example-collective"]').click();
  await expect(page.locator('.profile-panel')).toBeVisible();
});
for (const locale of ['en', 'zh-CN'])
  test(`About and compatibility routes remain accessible in ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`${base}/${locale}/contribute/`);
    await expect(page.locator('.about-panel')).toBeVisible();
    expect(
      (await new AxeBuilder({ page }).analyze()).violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      ),
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto(`${base}/${locale}/organizations/civic-library/`);
    await expect(page.locator('.profile-panel')).toBeVisible();
  });

test('wrapped map discovery renders and selects an antimeridian star', async ({
  page,
  request,
}) => {
  const d = await (await request.get(`${base}/data/map.json`)).json();
  d.nodes = [
    {
      ...d.nodes[0],
      id: 'pacific',
      locations: [{ ...d.nodes[0].locations[0], latitude: 0, longitude: -170 }],
    },
  ];
  d.links = [];
  await page.route('**/data/map.json', (r) => r.fulfill({ json: d }));
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition(success: PositionCallback) {
          success({
            coords: { latitude: 0, longitude: 180, accuracy: 10 },
          } as GeolocationPosition);
        },
      },
    }),
  );
  await page.goto(`${base}/en/`);
  await page
    .getByRole('button', { name: 'Use my location', exact: true })
    .click();
  await expect(page.locator('.visitor-marker')).toBeVisible();
  for (let i = 0; i < 5; i++)
    await page.getByRole('button', { name: 'Zoom out', exact: true }).click();
  const star = page.locator('.geo-star[data-node="pacific"]').first();
  await expect(star).toBeVisible();
  await star.click();
  await expect(page.locator('.profile-panel')).toBeVisible();
});
test('small zoom/reset controls work without dismissing a profile', async ({
  page,
}) => {
  await page.goto(`${base}/en/?view=gather&node=example-collective`);
  await expect(page.locator('.profile-panel')).toBeVisible();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await page.getByRole('button', { name: 'Zoom out', exact: true }).click();
  await page
    .getByRole('button', { name: 'Reset gathered view', exact: true })
    .click();
  await expect(page.locator('.profile-panel')).toBeVisible();
  await page.getByRole('button', { name: 'Switch to scattered map' }).click();
  await page.getByRole('button', { name: 'Reset map', exact: true }).click();
  await expect(page.locator('.profile-panel')).toBeVisible();
});

test('manual geographic pan survives language and mode changes after location', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition(success: PositionCallback) {
          success({
            coords: { latitude: 55.6761, longitude: 12.5683, accuracy: 80 },
          } as GeolocationPosition);
        },
      },
    }),
  );
  await page.goto(`${base}/en/`);
  await page
    .getByRole('button', { name: 'Use my location', exact: true })
    .click();
  const visitor = page.locator('.visitor-marker');
  await expect(visitor).toBeVisible();
  await page.mouse.move(700, 350);
  await page.mouse.down();
  await page.mouse.move(800, 400, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(800);
  const original = (await visitor.boundingBox())!;
  await page.getByRole('button', { name: /EN\/CN/ }).click();
  await expect(visitor).toBeVisible();
  let r = (await visitor.boundingBox())!;
  expect(Math.abs(r.x - original.x)).toBeLessThan(2);
  await page.getByRole('button', { name: '切换至聚星图' }).click();
  await page.getByRole('button', { name: '切换至散地图' }).click();
  await expect(visitor).toBeVisible();
  r = (await visitor.boundingBox())!;
  expect(Math.abs(r.x - original.x)).toBeLessThan(2);
  expect(Math.abs(r.y - original.y)).toBeLessThan(2);
});

test('touch pinch and node dragging preserve the open profile', async ({
  page,
}) => {
  await page.goto(`${base}/en/?view=gather&node=example-collective`);
  await expect(page.locator('.profile-panel')).toBeVisible();
  await page.waitForTimeout(800);
  const cdp = await page.context().newCDPSession(page),
    scene = page.locator('.graph-scene'),
    before = await scene.getAttribute('style');
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [
      { x: 100, y: 250, id: 1 },
      { x: 200, y: 250, id: 2 },
    ],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [
      { x: 100, y: 250, id: 1 },
      { x: 260, y: 250, id: 2 },
    ],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  expect(await scene.getAttribute('style')).not.toBe(before);
  await expect(page.locator('.profile-panel')).toContainText(
    'Example Collective',
  );
  const star = page.locator('.graph-star[data-node="rainbow-circle"]'),
    r = (await star.boundingBox())!;
  expect(
    await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.getAttribute('data-node'),
      { x: r.x + 22, y: r.y + 22 },
    ),
  ).toBe('rainbow-circle');
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: r.x + 22, y: r.y + 22, id: 3 }],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: r.x + 102, y: r.y + 62, id: 3 }],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  expect((await star.boundingBox())!.x - r.x).toBeGreaterThan(60);
  await expect(page.locator('.profile-panel')).toContainText(
    'Example Collective',
  );
});
