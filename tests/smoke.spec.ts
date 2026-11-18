/*
  Smoke tests: quick checks that every built page works.

  For every page:
  - it loads
  - it's in Australian English (lang="en-AU") with a title
  - it has exactly one <h1> and a <main id="main">
  - "Skip to content" is the first thing Tab reaches, and it works
  - nothing scrolls sideways on a 320px-wide screen
  - every link to another page on this site works

  Across all pages: every page title is different.

  Never weaken, skip or delete these tests to make them pass (AGENTS.md, rule 2).
*/
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getBuiltPages, DIST } from './pages';

const pages = getBuiltPages();

for (const { path } of pages) {
  test.describe(`Smoke: ${path}`, () => {
    test('loads, with language, title, one h1 and a main landmark', async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), 'Page should load').toBeLessThan(400);

      await expect(page.locator('html')).toHaveAttribute('lang', 'en-AU');
      expect((await page.title()).trim(), 'Page needs a <title>').not.toBe('');
      await expect(page.locator('h1'), 'Page needs exactly one <h1>').toHaveCount(1);
      await expect(page.locator('main#main'), 'Page needs <main id="main">').toHaveCount(1);
    });

    test('skip link is first and moves focus to the main content', async ({ page }) => {
      await page.goto(path);
      await page.keyboard.press('Tab');

      const skipLink = page.getByRole('link', { name: 'Skip to content' });
      await expect(skipLink, 'Skip link should be the first thing Tab reaches').toBeFocused();
      await expect(skipLink, 'Skip link should be visible when focused').toBeInViewport();

      await page.keyboard.press('Enter');
      await expect(page.locator('main#main'), 'Skip link should move focus to <main>').toBeFocused();
    });

    test('has no sideways scrolling at 320px wide', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, 'Page is wider than the screen at 320px').toBeLessThanOrEqual(0);
    });

    test('every internal link works', async ({ page, request, baseURL }) => {
      await page.goto(path);
      const origin = new URL(baseURL!).origin;

      const hrefs = await page.locator('a[href]').evaluateAll((links) =>
        links.map((a) => (a as HTMLAnchorElement).href),
      );
      const internal = [
        ...new Set(
          hrefs
            .filter((href) => href.startsWith(origin))
            .map((href) => href.split('#')[0]),
        ),
      ];

      for (const url of internal) {
        const res = await request.get(url);
        expect(res.status(), `Broken link on ${path}: ${url}`).toBeLessThan(400);
      }

      // Same-page links like #main must point to something that exists
      const anchors = await page.locator('a[href^="#"]').evaluateAll((links) =>
        links.map((a) => a.getAttribute('href')!).filter((h) => h.length > 1),
      );
      for (const anchor of anchors) {
        await expect(page.locator(anchor), `Link to ${anchor} on ${path} has no target`).toHaveCount(1);
      }
    });
  });
}

test('every page has a different title', () => {
  const titles = pages.map(({ file }) => {
    const html = readFileSync(join(DIST, file), 'utf8');
    return html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim() ?? '';
  });
  const duplicates = titles.filter((t, i) => titles.indexOf(t) !== i);
  expect(duplicates, 'These titles are used on more than one page').toEqual([]);
});
