# AGENTS.md: Oh It's Cancer website

Instructions for any AI coding tool working on this site (Claude Code, Copilot, Codex, Gemini, Cursor). Read this whole file before making changes. If a request conflicts with these rules, stop and explain the conflict instead of working around it.

`CLAUDE.md` contains one line, `@AGENTS.md`, so every tool follows the same rules.

---

## 1. What this site is

- **Name:** Oh It's Cancer (full title: "Oh Shit! It's Cancer. Now What?")
- **Owner:** Erin, Illawarra Cancer Social Group (not-for-profit, NSW)
- **Built by:** Abby Schmidt, Clever Little Schmidt (pro bono), then handed to Erin to run
- **Purpose:** a directory of services, products, people and connection points for people living through and after cancer, with a lighthearted, personal tone. Long-term inspiration: wegotthis.org, adapted for Australia.
- **Style:** 1950s rockabilly / drive-in / theatre. Theatre metaphors run through the copy ("the troupe", "Chookas!").

### Who uses it

Many visitors are in treatment or recovering. Assume some have:
- trouble concentrating, poor short-term memory and fatigue ("chemo brain")
- numb fingers or tremor (peripheral neuropathy), making small targets hard to hit
- blurred or changed vision
- hearing loss
- nausea or sensitivity to motion and flashing light
- high emotional load

Every decision should make the site easier for these people. When in doubt, choose the simpler, calmer, clearer option.

### Who maintains it

Erin, who is not a developer. She edits content through a CMS and may use AI tools to make code changes. The code must stay simple, well commented in plain English, and hard to break.

---

## 2. Non-negotiable rules

1. **WCAG 2.2 AA is the minimum.** No change ships if it fails. See section 5.
2. **Never weaken, skip or delete a test to make it pass.** Fix the code instead. If a test seems wrong, stop and explain why.
3. **No backend, database or user accounts.** The site is static. Anything dynamic uses an approved third-party embed or a small Netlify Function, only with approval.
4. **No secrets in the code.** API keys and tokens go in Netlify environment variables only. The repo is public.
5. **No new dependencies without asking.** Explain what it does, why it's needed and its size. Prefer no dependency.
6. **No tracking, analytics or third-party scripts** without approval. No cookie banners needed means no cookies set.
7. **Never invent content.** No made-up organisations, listings, quotes, statistics, testimonials or medical information. Use clearly marked placeholders (`[PLACEHOLDER: ...]`) instead.
8. **No medical advice.** The site points to services. It does not tell people how to treat anything.
9. **Australian English** (Macquarie Dictionary) in all copy, comments and alt text.
10. **Don't push to `main`.** Work on a branch and open a pull request. Netlify builds a preview for every pull request.

---

## 3. Tech stack

| Part | Choice | Notes |
|---|---|---|
| Framework | Astro (current stable) | Static output only (`output: 'static'`) |
| Styling | Plain CSS with custom properties | No CSS framework. Tokens live in `src/styles/tokens.css` |
| Content | Astro content collections | Schemas in `src/content.config.ts`, validated with Zod |
| CMS | Pages CMS (git-based, hosted app at app.pagescms.org) | Config in `.pages.yml`. Content is stored as files in this repo, so nothing is lost if the CMS changes. Plan B if Pages CMS disappears: Sveltia CMS. Keep `.pages.yml` simple so switching stays easy |
| Directory search and filters | Vanilla JavaScript, no library | Progressive enhancement: the full list works with JavaScript off |
| Site-wide search (later) | Pagefind | Static, free, runs at build time |
| Hosting | Netlify (free plan) | Site owned by Erin's account |
| Repo | GitHub organisation owned by Erin, public repo | Rulesets protect `main` with no bypass list |
| Forms | Netlify Forms (later stages) | Every field labelled, errors announced |
| Tests | Playwright + `@axe-core/playwright` | Run on every page, every pull request |

Keep the dependency list short. Every package is something Erin may one day have to update.

---

## 4. Project structure

```
src/
  components/      Small reusable pieces (Button, ListingCard, SkipLink)
  sections/        Page sections Erin can stack in the CMS (Hero, CardGrid, TextBlock, CallToAction)
  layouts/         BaseLayout.astro: head, skip link, header, main, footer
  pages/           Routes
  content/
    listings/      One file per directory listing
    categories/    One file per category
    pages/         Page content built from sections
.pages.yml         Pages CMS configuration (fields Erin sees)
  styles/
    tokens.css     Colours, type, spacing. The only place colours are defined
    global.css     Base styles, focus styles, reduced motion
  assets/          Images processed by astro:assets
public/            Files served as-is (favicon, robots.txt)
tests/             Playwright accessibility and smoke tests
```

Rules:
- One component per file. Name files for what they are, not how they look.
- Comment the top of every component in plain English: what it's for and what props it takes.
- New page layouts are built from sections. If a new section is needed, add it to `src/sections/` and register it with the CMS so Erin can use it.

---

## 5. Accessibility rules

### Structure
- One `<h1>` per page. Headings in order, no skipped levels.
- Use landmarks: `<header>`, `<nav>`, `<main id="main">`, `<footer>`.
- A "Skip to content" link is the first focusable element on every page.
- `lang="en-AU"` on `<html>`.
- Every page has a unique, descriptive `<title>`.

### Text and logo
- The site title ("Oh Shit! It's Cancer. Now What?") must be real text, styled to match the marquee design. It can sit inside decorative artwork, but it can't be an image of text.
- Body text at least 18px (1.125rem), line height at least 1.5.
- Line length no more than about 70 characters (`max-width: 70ch`).
- Text must stay readable at 200% zoom and reflow at 320px wide with no sideways scrolling.
- Script and display fonts only for large headings and decorative words. Never for body text, links, buttons, form labels or navigation.
- Avoid long runs of all-caps text. Short labels are fine.

### Colour and contrast
- Normal text: 4.5:1 minimum. Large text (24px+, or 18.66px+ bold): 3:1.
- Buttons, inputs, focus outlines and meaningful icons: 3:1 against what's next to them.
- Only use the approved pairs in section 6. Any new pair must be checked and added there first.
- Never use colour alone to show meaning.
- No text over patterns (polka dots, gingham, starbursts) or busy illustrations. Put a solid panel behind it.

### Interaction
- Links go somewhere, buttons do something. Never use a clickable `<div>` or `<span>`.
- Tap targets at least 44 × 44px.
- A clear, high-contrast focus outline on everything focusable. Never remove outlines without a visible replacement.
- Everything works with a keyboard alone, in a logical order. No keyboard traps.
- Card links: the whole card is one link, with the card title as its accessible name. No nested links in cards.
- Link text makes sense out of context. No "click here" or "read more" on its own.
- External links open in the same tab. Mark them with an icon plus visually hidden text "(external site)".
- Phone numbers are `tel:` links. Emails are `mailto:` links.

### Motion and media
- Respect `prefers-reduced-motion: reduce`. With it on, all animation stops.
- Marquee bulb lights: still by default. If animated at all, slow and gentle, never more than 3 flashes per second, and off under reduced motion.
- No autoplaying video or audio. No carousels or sliders.
- Video has captions. Audio has a transcript.

### Images
- Every meaningful image has alt text describing what matters, in plain language.
- Decorative images (starbursts, cars, popcorn, icons next to a text label) use `alt=""`.
- Alt text is a required CMS field. The build warns when it's empty.

### Forms (later stages)
- Every input has a visible `<label>`. Placeholders are not labels.
- Required fields marked in text, not just with an asterisk or colour.
- Errors explained in words next to the field and announced to screen readers.
- Don't ask for anything you don't need. Don't time out.

### Cognitive load
- Plain language. Short sentences and paragraphs.
- Navigation is the same on every page, with the same names.
- **Plain labels come first, theatre names second.** Example: "About us" large, "The Program" small. The menu and the cards must use the same plain labels.
- Explain jargon and slang the first time it appears (for example, "Chookas!" = theatre slang for "good luck").

---

## 6. Design tokens

All colours are defined once in `src/styles/tokens.css`. Do not hard-code hex values anywhere else.

### Palette

| Token | Hex | Use |
|---|---|---|
| `--colour-red` | `#cc2d30` | Buttons, accents, large headings |
| `--colour-mint` | `#9bdbc1` | Card and banner backgrounds |
| `--colour-butter` | `#efe8ad` | Card backgrounds |
| `--colour-green` | `#aadd96` | Card backgrounds |
| `--colour-pink` | `#e8a5af` | Card backgrounds |
| `--colour-maroon` | `#4f0000` | Page background (sections) |
| `--colour-mustard` | `#ebb649` | Text on maroon |
| `--colour-warm-white` | `#f8f4ed` | Light neutral, default light background, text on dark |
| `--colour-black` | `#0a0505` | Dark neutral, default body text |
| `--colour-night` | `#0d1b4a` | Hero sky, header, dark sections |

Use warm white instead of pure white everywhere, including button text.

### Approved text and background pairs

| Text | Background | Ratio | OK for |
|---|---|---|---|
| Black | Warm white | 18.47:1 | All text (default) |
| Black | Butter | 16.22:1 | All text |
| Black | Green | 13.01:1 | All text |
| Black | Mint | 12.82:1 | All text |
| Black | Mustard | 10.92:1 | All text |
| Black | Pink | 10.06:1 | All text |
| Warm white | Night | 15.05:1 | All text |
| Warm white | Maroon | 14.38:1 | All text |
| Butter, green or mint | Night | 10.45–13.21:1 | All text |
| Butter, green or mint | Maroon | 9.98–12.62:1 | All text |
| Mustard | Night | 8.89:1 | All text |
| Mustard | Maroon | 8.50:1 | All text |
| Pink | Night | 8.20:1 | All text |
| Pink | Maroon | 7.83:1 | All text |
| Warm white | Red | 4.81:1 | All text and buttons. Only just passes: never lighten the red or darken the warm white |
| Black | Red | 3.84:1 | Large text and icons only |
| Red | Butter | 4.22:1 | Large text and icons only |
| Red | Night | 3.13:1 | Large text and icons only |

### Banned pairs (fail even for large text)
- Warm white on mint, butter, green, pink or mustard (1.14–1.84:1). This includes the current white "Chookas!" on mint banner, which must change.
- Any pastel on another pastel, or mustard on a pastel (1.01–1.61:1).
- Red on maroon (2.99:1), red on pink (2.62:1), red on mustard (2.84:1).
- Black on night (1.23:1), black on maroon (1.29:1), night on maroon (1.05:1).

### Focus outline
Must reach 3:1 against the background it sits on:
- Light backgrounds (warm white, pastels, mustard): black outline
- Night or maroon: warm white or mustard outline
- Red: warm white outline (mustard fails at 2.84:1)

### Typography
- Display / marquee font: **Federo** (SIL Open Font License). One weight, no italic. May be swapped for a paid font later; check its web licence first.
- Script font: **Yellowtail** (Apache License 2.0).
- Body font: **Atkinson Hyperlegible Next** (SIL Open Font License), weights 200 to 800 with italics. A clear sans-serif with distinct letter shapes (I, l, 1 easy to tell apart).
- Font files and their licences are in `public/fonts/`. The `@font-face` rules are in `src/styles/fonts.css`.
- Fonts must be free for web use or properly licensed. Self-host them; no external font calls.

---

## 7. Content model

Edited by Erin in Pages CMS. Works like a WordPress custom post type with a custom taxonomy. The same rules are defined twice on purpose: in `.pages.yml` (so the CMS guides Erin) and in `src/content.config.ts` (so the build rejects anything that slips through). Keep the two in sync.

### Categories (`src/content/categories/`)

Erin can add, rename and reorder categories herself. Each category belongs to one site section, which decides where its listings appear.

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | text | yes | Shown as the filter label and group heading |
| `section` | select: products, people, connect | yes | Where this category's listings display |
| `description` | text, max 25 words | no | Shown under the group heading |
| `order` | number | yes | Sort order within the section |

### Listings (`src/content/listings/`)

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | text | yes | |
| `summary` | text, max 40 words | yes | The "info" field. Plain language |
| `url` | text, must start with `https://` | yes | External link |
| `category` | reference to a category | yes | Pages CMS reference field (dropdown with search) |
| `region` | select: Illawarra, NSW, national, online | yes | |
| `free` | true/false | no (defaults to false) | Ticked shows "Free" on the card. Unticked means paid or unknown, and shows nothing about cost |
| `phone` | text | no | Rendered as a `tel:` link |
| `email` | text | no | |
| `logo` | image | no | |
| `logoAlt` | text | yes if logo | Usually the organisation's name |
| `published` | true/false | yes | Unpublished listings never build |
| `lastChecked` | date | yes | When the link and details were last confirmed |

Region options are fixed in code. Ask Abby before changing them.

The build must fail with a clear, plain-English message if a required field is missing, a URL is malformed or a listing points to a category that doesn't exist. Netlify then keeps the last working version live.

### Directory page behaviour

Each section page (Products, People, Connect) shows its listings grouped by category.

**Without JavaScript:** every published listing is in the HTML, grouped under category headings. Nothing is hidden. This is the baseline.

**With JavaScript, a filter bar above the list:**
- A search box (labelled "Search listings") matching name, summary and category as you type, with a short debounce.
- Category filter as a group of checkboxes inside a `<fieldset>` with a `<legend>`.
- Region filter as a labelled `<select>`.
- A "Free only" checkbox with a visible label.
- A results count in an `aria-live="polite"` region, for example "Showing 12 of 48 listings".
- A "Clear filters" button.
- A friendly no-results message that suggests clearing filters.
- Filter state is saved in the URL query string, so results can be shared and the back button works.
- Hiding listings uses the `hidden` attribute. Never move focus when filters change.
- Category headings with no visible listings are hidden too.
- Under about 500 listings per section, filter in the browser. Above that, revisit (pagination or Pagefind).

**Listing card:** name as the heading and link, then summary, category, region and "Free" (if ticked) as text (not colour alone), then phone and email if present. The external link follows the rules in section 5.

---

## 8. Site structure (stage 1)

| Plain label | Theatre name | Contents |
|---|---|---|
| Home | | Hero, section cards, Synopsis intro |
| About us | The Program | Who the group is, Erin's story |
| Products | Costuming | Directory listings |
| People | Props | Directory listings |
| Connect | Rehearsals | Groups, events, ways to connect |

Later stages (not now): register your organisation form with listing fee, donations, map (with a text list alongside), events, registry.

### Content notes from the mock-up
- "REHERSALS" is misspelt. Use "Rehearsals".
- The Synopsis quote is credited to "Miriam Webster". The correct name is Merriam-Webster, and the quote needs checking before it goes live. Flag it; don't silently fix or remove it.
- The asterisk after "Chookas!" needs a real footnote explaining the term.

---

## 9. Testing and checks

`npm run check` must pass before any pull request is opened. It runs:
1. `astro check`: types and content schemas
2. `astro build`: the site builds
3. Playwright + axe on every built page: no WCAG 2.2 AA violations
4. Smoke tests: every page loads, the skip link works, every internal link resolves

Rules:
- Add new pages to the test list automatically. Don't maintain the list by hand.
- Automated tools miss most issues. After any visual or interactive change, also check:
  - keyboard only: can you reach and use everything, and see where focus is?
  - 200% zoom and a 320px-wide window
  - reduced motion turned on
  - the Netlify preview on a real phone
- A scheduled GitHub Action checks external listing links weekly and opens an issue listing broken ones.

---

## 10. Working rules for AI tools

- Before changing anything, say what you plan to change and which files are affected.
- Make the smallest change that does the job. Don't refactor unrelated code.
- Don't change design tokens, the content schema or this file unless asked.
- After changes, run `npm run check` and report the result honestly, including failures.
- Explain changes in plain English. Erin is not a developer.
- If you're unsure what Erin or Abby wants, ask. Don't guess.

---

## 11. Build safety

The live site rarely breaks. The risk is the build: over time, tools change and Erin's edits stop publishing. These rules keep the build working for as long as possible with no maintenance.

### Pin everything
- **Node version:** pin to the current Active LTS at setup time (check nodejs.org). Set it in three places so they always match: `.nvmrc`, `"engines"` in `package.json`, and `NODE_VERSION` in `netlify.toml`.
- **Exact dependency versions:** add `save-exact=true` to `.npmrc`. No `^` or `~` ranges.
- **Lockfile:** `package-lock.json` is always committed. Netlify builds with `npm ci`, never `npm install`.
- **Build settings live in `netlify.toml`** (build command, publish folder, Node version, headers), not in the Netlify dashboard. The repo is the single source of truth.

### Updates: security only
- Turn on **Dependabot security updates** in the repo settings. Do **not** add version updates. Routine upgrades create pull requests Erin can't judge.
- A Dependabot pull request only gets merged if every check passes. If checks fail, leave it open and get help.
- Never upgrade Astro to a new major version just because one exists. Only upgrade when something stops working or a security fix needs it.

### Protect the `main` branch (GitHub ruleset)
- Require a pull request before merging.
- Require `npm run check` to pass.
- Block force pushes and branch deletion.
- **Bypass list: the Pages CMS GitHub App only.** This lets CMS content edits commit straight to `main`. Netlify still validates them at build, and a failed build never goes live. No people on the bypass list, including owners.
- If GitHub's rulesets can't add the Pages CMS app to the bypass list, stop and tell Abby. Don't loosen the rules to make it work.
- The repo is public so rulesets apply on GitHub's free plan.

### Red flags in a pull request
Stop and get help if a pull request:
- changes anything in `tests/`
- changes `AGENTS.md`, `CLAUDE.md`, `.pages.yml`, `netlify.toml`, `package.json` or the ruleset
- changes colour tokens without updating the approved pairs table

### Accounts and access
- **2FA on** for GitHub, Netlify, Pages CMS (via GitHub) and the domain registrar.
- **Recovery codes** for every account saved in a password manager, with a printed copy kept somewhere safe.
- **A second owner** on the GitHub organisation: a trusted person from the group. If Erin is locked out, they can restore access.
- **Netlify:** check how many members the free plan allows. If it's only one, that's acceptable: the site can be redeployed from GitHub to a new Netlify account in minutes. GitHub access is the one that matters.
- **Domain:** registered in Erin's or the group's name, auto-renew on, a card that won't expire soon, and the second owner listed as a contact if the registrar allows it.

### Yearly check-up (about an hour, with an AI tool or a developer)
1. Does the site still build? Run `npm ci && npm run check`.
2. Is the pinned Node version close to end of life? If so, move to the current LTS and re-test.
3. Run `npm audit` and fix anything high or critical.
4. Log in to Pages CMS and make a test edit.
5. Check the domain renewal date and the card on file.
6. Review the broken-link issues from the weekly checker.
7. Confirm 2FA, recovery codes and the second owner are still current.

---

## 12. Owner notes (for Erin)

- **Content changes** (listings, text, images): use the CMS. No AI tool needed.
- **Code changes** (new sections, features, design): use an AI tool on a branch, check the preview link on your phone, then merge.
- **Something broke?** In Netlify, open Deploys, pick the last working deploy and choose "Publish deploy". The old version is back in seconds.
- **The domain must auto-renew.** If it lapses, the site disappears. Keep the card on file current.
- **Keep 2FA on** for GitHub and Netlify. These two logins control the site. Keep your recovery codes somewhere safe.
- **A pull request that changes tests or settings files is a red flag.** See "Red flags in a pull request" in section 11.
- **Once a year**, do the check-up in section 11, or ask someone to.
