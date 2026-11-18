/*
  Content rules: what a category and a listing must contain.

  The build checks every file against these rules. If something is
  wrong (a missing field, a bad web address, a category that doesn't
  exist), the build stops with a plain-English message and Netlify keeps
  the last working version live.

  The same rules are in .pages.yml, so Pages CMS guides Erin while she
  types. Keep the two files in sync (AGENTS.md, section 7).

  Region and cost options are fixed. Ask Abby before changing them.
*/
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// ---------- Fixed options ----------
export const SECTIONS = ['products', 'people', 'connect'] as const;
export const REGIONS = ['Illawarra', 'NSW', 'national', 'online'] as const;
export const COSTS = ['free', 'paid', 'varies'] as const;

// ---------- Helpers ----------

/** Counts words, e.g. "Free wigs for women" is 4 words. */
const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

/**
 * Pages CMS may save an empty optional field as "" or null.
 * This treats those as "not filled in", so they don't fail the checks.
 */
const emptyToUndefined = (value: unknown) =>
  value === '' || value === null ? undefined : value;

/**
 * Pages CMS may save a category link as a file name ("wigs.yml") or a
 * full path ("src/content/categories/wigs.yml"). The build needs just "wigs".
 */
const toCategoryId = (value: unknown) =>
  typeof value === 'string'
    ? value.split('/').pop()!.replace(/\.(ya?ml)$/i, '')
    : value;

/**
 * Pages CMS saves uploaded logos as "/src/assets/logos/name.png".
 * Astro needs the path relative to the listing file, so this turns it into
 * "../../assets/logos/name.png" (listings live in src/content/listings/).
 */
const toLogoPath = (value: unknown) =>
  typeof value === 'string' && value.startsWith('/src/assets/')
    ? '../../' + value.slice('/src/'.length)
    : value;

/**
 * The names of all category files, e.g. "wigs" for wigs.yml.
 * Astro only warns when a listing points to a category that doesn't exist,
 * so we check it ourselves and stop the build (AGENTS.md, section 7).
 */
const categoryFiles = import.meta.glob('./content/categories/*.{yml,yaml}', {
  query: '?raw',
  import: 'default',
});
const categoryIds = new Set(
  Object.keys(categoryFiles).map((path) =>
    path.split('/').pop()!.replace(/\.(ya?ml)$/i, '').toLowerCase(),
  ),
);

// ---------- Categories ----------
const categories = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/categories' }),
  schema: z.object({
    name: z
      .string({ error: 'Every category needs a name.' })
      .trim()
      .min(1, { error: 'Every category needs a name.' }),
    section: z.enum(SECTIONS, {
      error: `Section must be one of: ${SECTIONS.join(', ')}.`,
    }),
    description: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .refine((text) => wordCount(text) <= 25, {
          error: 'Keep the category description to 25 words or fewer.',
        })
        .optional(),
    ),
    order: z.coerce
      .number({ error: 'Order must be a number, e.g. 1, 2 or 3.' })
      .int({ error: 'Order must be a whole number, e.g. 1, 2 or 3.' })
      .min(0, { error: 'Order can’t be negative.' }),
  }),
});

// ---------- Listings ----------
const listings = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/listings' }),
  schema: ({ image }) =>
    z
      .object({
        name: z
          .string({ error: 'Every listing needs a name.' })
          .trim()
          .min(1, { error: 'Every listing needs a name.' }),

        summary: z
          .string({ error: 'Every listing needs a summary.' })
          .trim()
          .min(1, { error: 'Every listing needs a summary.' })
          .refine((text) => wordCount(text) <= 40, {
            error: 'Keep the summary to 40 words or fewer.',
          }),

        url: z
          .string({ error: 'Every listing needs a web address.' })
          .trim()
          .startsWith('https://', { error: 'The web address must start with https://' })
          .refine((value) => URL.canParse(value), {
            error: 'The web address isn’t valid. Check it for typos or spaces.',
          }),

        category: z.preprocess(
          toCategoryId,
          z
            .string({ error: 'Every listing needs a category.' })
            .refine((id) => categoryIds.has(id.toLowerCase()), {
              error: 'This category doesn’t exist. Pick one from the list, or add the category first.',
            })
            .pipe(reference('categories')),
        ),

        region: z.enum(REGIONS, {
          error: `Region must be one of: ${REGIONS.join(', ')}.`,
        }),

        cost: z.enum(COSTS, {
          error: `Cost must be one of: ${COSTS.join(', ')}.`,
        }),

        phone: z.preprocess(
          emptyToUndefined,
          z
            .string()
            .trim()
            .regex(/^[0-9+()\s-]{6,20}$/, {
              error: 'The phone number can only contain numbers, spaces, +, ( ) and -.',
            })
            .optional(),
        ),

        email: z.preprocess(
          emptyToUndefined,
          z.email({ error: 'The email address isn’t valid.' }).optional(),
        ),

        logo: z.preprocess(emptyToUndefined, z.preprocess(toLogoPath, image()).optional()),

        logoAlt: z.preprocess(emptyToUndefined, z.string().trim().optional()),

        published: z.boolean({ error: 'Published must be ticked or unticked.' }),

        lastChecked: z.coerce.date({
          error: 'Add the date the details were last checked.',
        }),
      })
      // A logo needs a text description for people who can't see it
      .refine((listing) => !listing.logo || !!listing.logoAlt, {
        error: 'This listing has a logo, so it needs logo alt text (usually the organisation’s name).',
        path: ['logoAlt'],
      }),
});

export const collections = { categories, listings };
