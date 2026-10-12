import { test, expect } from './test';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('both locale routes and direct refresh work', async ({ page }) => {
  await page.goto(`${base}/en/`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto(`${base}/zh-CN/`);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
});
test('unknown paths return the static not-found page', async ({ page }) => {
  const response = await page.goto(`${base}/missing-profile/`);
  expect(response?.status()).toBe(404);
  await expect(page.getByText('Page not found')).toBeVisible();
});
