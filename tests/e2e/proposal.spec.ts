import { test, expect } from './test';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
test('questionnaire public handoff excludes private answers and downloads remain local drafts', async ({
  page,
}) => {
  await page.goto(`${base}/en/contribute/`);
  await page.getByLabel('Contribution type').selectOption('questionnaire');
  await page.getByLabel('Organization or proposal name').fill('Example');
  await page
    .getByLabel('Original summary / proposed change')
    .fill('A public original summary');
  await page
    .getByLabel('Public evidence URL (HTTPS)')
    .fill('https://example.org/evidence');
  await page
    .getByRole('textbox', {
      name: 'What does your organization do?',
      exact: true,
    })
    .fill('CONFIDENTIAL-RESPONSE');
  await page
    .getByRole('textbox', {
      name: 'Which organizations or institutions have you worked with?',
      exact: true,
    })
    .fill('Public partner account');
  await page
    .getByLabel('This answer may be shared publicly', { exact: true })
    .nth(1)
    .check();
  await page.getByLabel('I permit the proposal details above').check();
  await page.getByRole('button', { name: 'Preview proposal' }).click();
  await expect(page.locator('.proposal-preview pre')).not.toContainText(
    'CONFIDENTIAL-RESPONSE',
  );
  await expect(page.locator('.proposal-preview pre')).toContainText(
    'Public partner account',
  );
  const href = await page
    .getByRole('link', { name: 'Prepare public GitHub proposal' })
    .getAttribute('href');
  expect(new URL(href!).searchParams.get('body')).not.toContain(
    'CONFIDENTIAL-RESPONSE',
  );
  await expect(
    page.getByText('Editorial inbox is not configured.', { exact: false }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download proposal JSON' }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    'atlas-proposal-private.json',
  );
});

test('published relationships can receive a typed correction proposal', async ({
  page,
}) => {
  await page.goto(`${base}/en/contribute/`);
  await page.getByLabel('Contribution type').selectOption('correction');
  await page
    .getByLabel('Correction target', { exact: true })
    .selectOption('relationship');
  await page
    .getByLabel('Existing or candidate source ID')
    .fill('library-space');
  await page
    .getByLabel('Organization or proposal name')
    .fill('Relationship correction');
  await page
    .getByLabel('Original summary / proposed change')
    .fill('Correct the documented period');
  await page
    .getByLabel('Public evidence URL (HTTPS)')
    .fill('https://example.org/evidence');
  await page.getByLabel('I permit the proposal details above').check();
  await page.getByRole('button', { name: 'Preview proposal' }).click();
  await expect(page.locator('.proposal-preview pre')).toContainText(
    '"correction_target_kind": "relationship"',
  );
});
