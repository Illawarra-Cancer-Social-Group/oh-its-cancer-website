// Astro settings for the Oh It's Cancer website.
// The site is fully static: every page is built to plain HTML at build time.
// There is no server, database or user accounts (see AGENTS.md, rule 3).
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',

  // [PLACEHOLDER: the live web address, e.g. 'https://example.org.au'.
  // Add it once the domain is chosen. Astro uses it for full links in the sitemap and social previews.]
  // site: '',
});
