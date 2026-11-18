/*
  Directory filter tests: the search box hides listings that don't match,
  says how many are showing, keeps the search in the web address, and
  "Clear filters" brings everything back. Without JavaScript the filter
  bar stays hidden and every listing shows (AGENTS.md, section 7).

  Uses whichever directory page has listings, so it keeps working as
  Erin adds and removes content.

  Never weaken, skip or delete these tests to make them pass (AGENTS.md, rule 2).
*/
import { test, expect, type Page } from '@playwright/test';

const DIRECTORY_PAGES = ['/products/', '/people/', '/connect/'];

async function findPageWithListings(page: Page) {
  for (const path of DIRECTORY_PAGES) {
    await page.goto(path);
    if ((await page.locator('[data-listing]').count()) > 0) return path;
  }
  throw new Error('No directory page has listings, so the filters can’t be tested.');
}

test('search hides non-matching listings and Clear filters brings them back', async ({ page }) => {
  const path = await findPageWithListings(page);
  const listings = page.locator('[data-listing]');
  const total = await listings.count();
  const count = page.locator('[data-count]');
  const word = total === 1 ? 'listing' : 'listings';

  await expect(page.getByRole('search', { name: 'Filter listings' })).toBeVisible();
  await expect(count).toHaveText(`Showing ${total} of ${total} ${word}`);

  await page.getByLabel('Search listings').fill('zzzz-no-such-listing');
  await expect(count).toHaveText(`Showing 0 of ${total} ${word}`);
  await expect(page.locator('[data-listing]:visible')).toHaveCount(0);
  await expect(page.locator('[data-group]:visible')).toHaveCount(0);
  await expect(page.getByText('No listings match your search or filters.')).toBeVisible();
  await expect(page).toHaveURL(`${path}?q=zzzz-no-such-listing`);

  // Opening the saved address shows the same results
  await page.reload();
  await expect(count).toHaveText(`Showing 0 of ${total} ${word}`);

  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(count).toHaveText(`Showing ${total} of ${total} ${word}`);
  await expect(page.locator('[data-listing]:visible')).toHaveCount(total);
  await expect(page).toHaveURL(path);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the filter bar is hidden and every listing shows', async ({ page }) => {
    await findPageWithListings(page);
    await expect(page.getByRole('search', { name: 'Filter listings' })).toBeHidden();
    const listings = page.locator('[data-listing]');
    await expect(page.locator('[data-listing]:visible')).toHaveCount(await listings.count());
  });
});
