import { test, expect } from './test';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('denied location and blocked browser storage preserve manual search', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('blocked');
      },
    });
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition(
          _success: unknown,
          error: (e: { code: number }) => void,
        ) {
          error({ code: 1 });
        },
      },
    });
  });
  await page.goto(`${base}/en/`);
  await page
    .getByRole('button', { name: 'Use my location', exact: true })
    .click();
  await expect(
    page.getByText('Location permission was denied.', { exact: false }),
  ).toBeVisible();
  await page.getByRole('searchbox').fill('Example');
  await expect(page.locator('.directory-list')).toContainText(
    'Example Collective',
  );
  await page.getByRole('link', { name: '简体中文', exact: true }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('Example');
});
for (const locale of ['en', 'zh-CN'])
  test(`contribution and institution profile have accessible controls in ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    for (const path of ['contribute/', 'organizations/civic-library/']) {
      await page.goto(`${base}/${locale}/${path}`);
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
    }
  });
