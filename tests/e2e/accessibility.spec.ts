import { test, expect } from './test';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
for (const locale of ['en', 'zh-CN'])
  test(`accessible ${locale} atlas and mobile reflow`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/${locale}/`);
    await expect(page.getByRole('searchbox')).toBeVisible();
    await expect(page.locator('.organization-card').first()).toBeVisible();
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      ),
    ).toEqual([]);
    await page.setViewportSize({ width: 320, height: 800 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
