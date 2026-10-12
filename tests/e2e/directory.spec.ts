import { test, expect } from './test';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('directory searches both languages and restores filters across locale switching', async ({
  page,
}) => {
  await page.goto(`${base}/en/`);
  const search = page.getByRole('searchbox');
  await search.fill('示例');
  await expect(
    page.getByRole('link', { name: 'Example Collective', exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/q=/);
  await page.getByRole('link', { name: '简体中文', exact: true }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('示例');
  await expect(
    page.getByRole('link', { name: '示例社群', exact: true }),
  ).toBeVisible();
});
test('no results can be reset without map access', async ({ page }) => {
  await page.goto(`${base}/en/`);
  await page.getByRole('searchbox').fill('no-such-group');
  await expect(page.getByText('No matching communities')).toBeVisible();
  await page
    .getByRole('button', { name: 'Clear filters', exact: true })
    .click();
  await expect(
    page.getByRole('link', { name: 'Example Collective', exact: true }),
  ).toBeVisible();
});
