/*
  Finds every page in the built site, so tests check all of them.

  Nobody keeps a list of pages by hand: any new page is tested
  automatically once it's built (AGENTS.md, section 9).
*/
import { readdirSync, existsSync } from 'node:fs';
import { join, sep } from 'node:path';

export const DIST = join(process.cwd(), 'dist');

export interface BuiltPage {
  /** The web address path, e.g. "/" or "/about/" */
  path: string;
  /** The HTML file on disk, relative to dist/ */
  file: string;
}

export function getBuiltPages(): BuiltPage[] {
  if (!existsSync(DIST)) {
    throw new Error('No dist/ folder found. Run "npm run build" first (or use "npm run check").');
  }

  const pages = readdirSync(DIST, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.html'))
    // Astro's built-in 404 page is checked separately, not as a normal page
    .filter((file) => file !== '404.html')
    .map((file) => {
      const urlPath = '/' + file.split(sep).join('/');
      const path = urlPath.replace(/index\.html$/, '').replace(/\.html$/, '');
      return { path, file };
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  if (pages.length === 0) {
    throw new Error('The build produced no pages. Something is wrong with the build.');
  }

  return pages;
}
