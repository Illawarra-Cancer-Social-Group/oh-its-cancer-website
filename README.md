# Oh It's Cancer

**"Oh Shit! It's Cancer. Now What?"**: a friendly directory of services, products, people and connection points for people living through and after cancer. Run by the Illawarra Cancer Social Group.

## For Erin

- **Changing content** (listings, text, images): use Pages CMS. You don't need to touch the code.
- **Changing code** (new sections, features, design): use an AI tool on a branch, check the Netlify preview on your phone, then merge the pull request.
- **Something broke?** In Netlify, open Deploys, pick the last working deploy and choose "Publish deploy".

The rules for how this site is built are in [AGENTS.md](AGENTS.md). Every AI tool reads that file first.

## For developers

You need Node.js 26.13.1 (see `.nvmrc`).

```bash
npm ci          # install exact versions from the lockfile
npm run dev     # local preview at http://localhost:4321
npm run check   # types, build, then accessibility and smoke tests
```

`npm run check` must pass before any pull request is merged.
