# Changelog

All notable changes to Comparely are documented in this file.

## [0.4.0] — Developer Preview

Consistency and stability release. No new product-facing features were added on top of v0.3.0 — this release is a full audit and hardening pass across the multi-page site, so it's safe to treat as the first fully verified release of the new architecture.

- Verified every navigation link and footer link across Home, Compare, About, and Assistant resolves correctly (no 404s, no dead anchors).
- Verified every script reference loads the correct file, in the correct order, on every page.
- Confirmed every DOM id/class referenced by common.js, home.js, compare.js, and assistant.js exists in its corresponding page.
- Reorganized styles.css into one coherent, non-conflicting stylesheet (shared design system + nav/footer + Home + About + Assistant sections).
- Removed the last leftover file from the pre-multi-page architecture (the original single-file `script.js`).
- Ran an automated end-to-end check of search, category filtering, sorting, two-product comparison with winner highlighting, dark mode, and the Assistant chat flow.

## [0.3.0]

- Converted Comparely from a single-page app into a multi-page site: Home (`index.html`), Compare (`compare.html`), About (`about.html`), and Assistant (`assistant.html`), sharing one navigation and footer.
- Introduced Comparely Assistant: a dedicated chat-style interface (sidebar with conversation history/saved comparisons/recently viewed/favorites, welcome screen with suggested prompts, message bubbles, typing indicator, copy/regenerate/like/dislike, auto-resizing input). No live AI backend yet — responses are clearly-labeled preview placeholders.
- Split application logic into modular scripts: `common.js` (shared nav, footer, theme, toast, product-display utilities), `compare.js`, `home.js`, `assistant.js`.
- Added deep-linking from Home to Compare (featured products, categories, and trending comparisons link straight into a pre-filtered or pre-selected Compare page).
- Added "Show more" pagination to the product grid to keep the default view calm and fast at 150 products.

## [0.2.0]

- Expanded the product database from 20 to 150 products across five categories (Smartphones, Laptops, Headphones, Smartwatches, Tablets), each with pricing, specifications, features, pros, cons, and release year.
- Moved the product catalog into its own `products.js` file, separate from application logic.

## [0.1.0]

- Initial release: search, category filters, sorting, two-product side-by-side comparison with per-category winner highlighting, and dark/light mode.
