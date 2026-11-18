/*
  The site's main sections, in menu order.

  The menu and the page headings both read from this list, so the plain
  labels and theatre names always match (AGENTS.md, sections 5 and 8).
  The menu shows plain labels only (as in the mock-up). Page headings show
  the plain label large and the theatre name small underneath.

  To add a page to the menu, add it here and create the page in src/pages/.
*/
export interface NavItem {
  /** Plain label, shown large, e.g. "Products" */
  label: string;
  /** Theatre name, shown small underneath, e.g. "Costuming". Optional. */
  theatreName?: string;
  /** Web address, with a slash at the end, e.g. "/products/" */
  href: string;
  /**
   * The page's background colour, from tokens.css (e.g. "butter").
   * Only pastels that pass with black text: mint, butter, green or pink.
   */
  colour?: 'mint' | 'butter' | 'green' | 'pink';
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About us', theatreName: 'The Program', href: '/about/', colour: 'mint' },
  { label: 'Products', theatreName: 'Costuming', href: '/products/', colour: 'butter' },
  { label: 'People', theatreName: 'Props', href: '/people/', colour: 'pink' },
  { label: 'Connect', theatreName: 'Rehearsals', href: '/connect/', colour: 'green' },
];

/** Finds a menu item by its web address, e.g. navItem('/products/') */
export function navItem(href: string): NavItem {
  const item = NAV_ITEMS.find((i) => i.href === href);
  if (!item) throw new Error(`No menu item for ${href}. Add it to src/navigation.ts.`);
  return item;
}
