import { test, expect } from './test';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('generated bilingual profiles include evidence and exports are coherent', async ({
  page,
  request,
}) => {
  await page.goto(`${base}/en/organizations/example-collective/`);
  await expect(
    page.getByRole('heading', { name: 'Example Collective', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Sources & evidence' }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole('link', { name: '简体中文', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: '示例社群', exact: true }),
  ).toBeVisible();
  await page.goto(`${base}/en/data/`);
  await expect(
    page.getByRole('link', { name: 'Download CSV' }),
  ).toHaveAttribute('href', `${base}/data/organizations.csv`);
  const d = await (await request.get(`${base}/data/organizations.json`)).json();
  expect(
    d.organizations.some((o: { id: string }) => o.id === 'example-collective'),
  ).toBe(true);
  const edges = await (
    await request.get(`${base}/data/relationships.json`)
  ).json();
  expect(edges.dataset_version).toBe(d.dataset_version);
  expect(edges.relationships).toHaveLength(3);
});
