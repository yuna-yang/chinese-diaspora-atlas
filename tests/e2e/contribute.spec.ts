import { test, expect } from './test';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('contribution pages warn about public proposals and never invent contact links', async ({
  page,
}) => {
  await page.goto(`${base}/en/contribute/`);
  await expect(
    page.getByText(/GitHub Issues and Pull Requests are public/),
  ).toBeVisible();
  await expect(
    page.getByText('This channel is not configured for public use yet.'),
  ).toHaveCount(1);
  await expect(
    page.getByRole('link', { name: 'Open a GitHub proposal' }).first(),
  ).toHaveAttribute(
    'href',
    /github\.com\/yuna-yang\/chinese-diaspora-atlas\/issues\/new/,
  );
  await page.goto(`${base}/zh-CN/privacy/`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
