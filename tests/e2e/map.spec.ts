import { test, expect } from './test';
import records from '../fixtures/organizations.json' with { type: 'json' };
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('coincident organizations stay selectable at cluster zoom cap', async ({
  page,
  request,
}) => {
  const d = await (await request.get(`${base}/data/atlas.json`)).json();
  d.relationships = [];
  d.organizations = [
    records[0],
    {
      ...records[0],
      id: 'second-collective',
      names: { en: 'Second Collective', zh: '另一示例' },
    },
  ];
  await page.route(`**/data/atlas.json`, (r) => r.fulfill({ json: d }));
  await page.goto(`${base}/en/`);
  const cluster = page.getByRole('button', {
    name: '2 All nodes',
    exact: true,
  });
  await cluster.click();
  await cluster.click();
  await expect(page.locator('.cluster-list button')).toHaveCount(2);
  await page
    .locator('.cluster-list')
    .getByRole('button', { name: 'Second Collective', exact: true })
    .click();
  await expect(page.locator('.selection-preview')).toContainText(
    'Second Collective',
  );
});
test('map panning and view changes retain directory state', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/en/?q=Example`);
  await expect(page.getByRole('searchbox')).toHaveValue('Example');
  await page.getByRole('button', { name: 'Map', exact: true }).click();
  await expect(page.locator('.leaflet-map')).toBeVisible();
  await page.getByRole('button', { name: 'List', exact: true }).click();
  await expect(page.getByRole('searchbox')).toHaveValue('Example');
  await expect(
    page.getByRole('link', { name: 'Example Collective', exact: true }),
  ).toBeVisible();
});
