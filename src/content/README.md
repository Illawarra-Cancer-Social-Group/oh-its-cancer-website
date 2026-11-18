# Content

Everything Erin edits in Pages CMS lives here, one file per item.

- `categories/`: one YAML file per category. Each belongs to one site section (products, people or connect).
- `listings/`: one YAML file per directory listing.
- `pages/`: page content built from sections (later).

The rules each file must follow are in `src/content.config.ts` (checked by the build) and `.pages.yml` (shown in the CMS). Keep the two in sync. Logos uploaded in the CMS go to `src/assets/logos/`.

The `categories/` and `listings/` folders appear once the first item is added in the CMS.
