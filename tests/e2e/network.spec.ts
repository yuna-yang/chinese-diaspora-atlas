import { test, expect } from './test';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('selection shares one-hop cross-filter partners and restores on refresh', async ({
  page,
}) => {
  await page.goto(`${base}/en/?country=DK&node=example-collective`);
  await expect(page.locator('.directory-list')).not.toContainText(
    'Lantern Room',
  );
  const relations = page.getByRole('region', {
    name: 'Cooperation & relationships',
  });
  await expect(relations).toContainText('Lantern Room');
  await expect(relations).toContainText('Civic Library');
  await page.screenshot({
    path: 'test-results/atlas-desktop.png',
    fullPage: true,
  });
  await relations
    .getByRole('button', { name: 'Lantern Room', exact: true })
    .click();
  await expect(page).toHaveURL(/node=lantern-room/);
  await expect(page.locator('.selection-preview')).toContainText(
    'Partner context outside your filters',
  );
  await page.reload();
  await expect(page.locator('.selection-preview')).toContainText(
    'Lantern Room',
  );
  await page.getByRole('link', { name: '简体中文', exact: true }).click();
  await expect(page).toHaveURL(/node=lantern-room/);
  await expect(page.getByRole('region', { name: '合作与关系' })).toContainText(
    '凝聚',
  );
});
test('institution filters and relationship selections are independent of primary counts', async ({
  page,
}) => {
  await page.goto(`${base}/en/`);
  await page.getByLabel('Show', { exact: true }).selectOption('institution');
  await expect(page.locator('.directory-list')).toContainText('Civic Library');
  await expect(page.locator('.directory-list')).not.toContainText(
    'Example Collective',
  );
  await page
    .getByRole('region', { name: 'Cooperation & relationships' })
    .getByRole('button', { name: 'Inspect relationship' })
    .click();
  await expect(page).toHaveURL(/relationship=library-space/);
  await expect(page.locator('.relationship-preview')).toContainText('Linking');
});
