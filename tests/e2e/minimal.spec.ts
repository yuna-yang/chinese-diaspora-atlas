import { test, expect } from './test';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('minimal borderless interface has no search or old navigation', async ({
  page,
}) => {
  await page.goto(`${base}/en/`);
  await expect(page.locator('.minimal-atlas')).toBeVisible();
  await expect(page.getByRole('searchbox')).toHaveCount(0);
  await expect(
    page.locator('.site-header,.filters,.directory-panel,.hero'),
  ).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Use my location', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /EN\/CN/ })).toBeVisible();
  await expect(page.locator('.profile-panel')).toHaveCount(0);
  const r = await page.locator('.geo-canvas').boundingBox();
  expect(r!.width).toBeGreaterThan(1200);
  await page.screenshot({ path: 'test-results/minimal-desktop.png' });
});
test('stars open profiles, language/view switches retain them, About and outside dismiss', async ({
  page,
}) => {
  await page.goto(`${base}/en/?view=gather`);
  await page.locator('.graph-star[data-node="example-collective"]').click();
  await expect(page.locator('.profile-panel')).toContainText(
    'Example Collective',
  );
  await expect(page.locator('.profile-panel')).toContainText(
    'Public information',
  );
  await page.screenshot({ path: 'test-results/gathered-desktop.png' });
  await page.getByRole('button', { name: /EN\/CN/ }).click();
  await expect(page.locator('.profile-panel')).toContainText('示例社群');
  await expect(page).toHaveURL(/zh-CN.*view=gather.*node=example/);
  await page.getByRole('button', { name: '切换至散地图' }).click();
  await expect(page.locator('.profile-panel')).toContainText('示例社群');
  await page.getByRole('button', { name: '关于', exact: true }).click();
  await expect(page.locator('.about-panel')).toBeVisible();
  await expect(page.locator('.profile-panel')).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'GitHub', exact: true }),
  ).toHaveAttribute(
    'href',
    'https://github.com/yuna-yang/chinese-diaspora-atlas',
  );
  await page.getByRole('button', { name: '返回地图', exact: true }).click();
  await expect(page.locator('.profile-panel')).toHaveCount(0);
});
test('location is explicitly activated, clears and never enters URL', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition(success: PositionCallback) {
          success({
            coords: { latitude: 55.6761, longitude: 12.5683, accuracy: 80 },
          } as GeolocationPosition);
        },
      },
    });
  });
  await page.goto(`${base}/en/?view=gather`);
  await expect(page.locator('.visitor-marker')).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Use my location', exact: true })
    .click();
  await expect(page.locator('.visitor-marker')).toBeVisible();
  await expect(page).not.toHaveURL(/latitude|55\.6761|12\.5683/);
  await page
    .getByRole('button', { name: 'Clear my location', exact: true })
    .click();
  await expect(page.locator('.visitor-marker')).toHaveCount(0);
});
for (const locale of ['en', 'zh-CN'])
  test(`minimal mobile ${locale} accessibility and reflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`${base}/${locale}/?view=gather&node=example-collective`);
    await expect(page.locator('.profile-panel')).toBeVisible();
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      ),
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/minimal-mobile-${locale}.png`,
    });
    await page.keyboard.press('Escape');
    await expect(page.locator('.profile-panel')).toHaveCount(0);
  });
