import { test, expect } from './test';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('user activation locates without mutating search or URL, and clears the marker', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({
    latitude: 55.6761,
    longitude: 12.5683,
    accuracy: 100,
  });
  await page.route('https://tile.openstreetmap.org/**', (r) => r.abort());
  await page.goto(`${base}/en/?q=Example`);
  await expect(page.getByRole('searchbox')).toHaveValue('Example');
  await page
    .getByRole('button', { name: 'Use my location', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Clear my location', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.visitor-dot')).toBeVisible();
  expect(new URL(page.url()).searchParams.get('q')).toBe('Example');
  expect(page.url()).not.toContain('55.6761');
  await page
    .getByRole('button', { name: 'Clear my location', exact: true })
    .click();
  await expect(page.locator('.visitor-dot')).toHaveCount(0);
});
