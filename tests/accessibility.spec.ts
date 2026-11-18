/*
  Accessibility tests: runs axe on every built page and fails on any
  WCAG 2.2 AA problem it finds.

  Automated checks only catch some issues. Keyboard, zoom and
  reduced-motion checks by a person are still needed (AGENTS.md, section 9).

  Never weaken, skip or delete these tests to make them pass (AGENTS.md, rule 2).
*/
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { getBuiltPages } from './pages';

// Every WCAG rule level up to and including 2.2 AA
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const { path } of getBuiltPages()) {
  test.describe(`Accessibility: ${path}`, () => {
    test('has no WCAG 2.2 AA violations', async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

      // A readable summary, so failures explain themselves
      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`,
      );
      expect(summary, 'Accessibility problems found').toEqual([]);
    });

    test('has no WCAG 2.2 AA violations at 320px wide', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.help}`);
      expect(summary, 'Accessibility problems found on a narrow screen').toEqual([]);
    });

    test('has no WCAG 2.2 AA violations with the skip link showing', async ({ page }) => {
      await page.goto(path);
      await page.keyboard.press('Tab');
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.help}`);
      expect(summary, 'Accessibility problems found with the skip link focused').toEqual([]);
    });
  });
}
