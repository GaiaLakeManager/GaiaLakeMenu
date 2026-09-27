# Gaia Lake Menu — What's New

## v1.3 — 26 Sep 2026
- Version number and "What's New" note are now hardcoded in config.js and updated by the developer with each release — no more typing a version number into Admin → Settings each time. Settings now just shows the current version and note, read-only.
- Added a new logo.png reference on the Admin sign-in screen — replace the placeholder leaf icon with your actual logo by uploading a `logo.png` file alongside admin.html on GitHub Pages.
- Added dish "sub-options": a dish (e.g. "Hopper Night") can now have any number of named sub-items (e.g. Creamy Chicken Curry, Rich Prawn Curry, Traditional Black Pork Curry), each with its own price. When a dish has sub-options, its own top-level price is hidden and each sub-option's price is shown instead — both in Admin (Add/Edit Dish) and on the guest menu.
- Split all CSS out of index.html and admin.html into a shared style.css file, making both HTML files shorter and easier to work with. Both pages must now also load style.css from the same folder.

## v1.2 — 26 Sep 2026
- Removed the "Prices are shown for reference and may vary slightly at time of order." line from the guest page footer.
- Fixed the version number in the developer footer not updating — it's now written directly from the App Version field in Admin → Settings into its own element, instead of a text search-and-replace on the footer sentence, so it always matches what's saved there.
- Centered the logo and restaurant name on the banner on PC, tablet, and mobile (previously it only centered on narrow screens and drifted left on wider ones).
- Gave the logo/name a subtle frosted dark badge over the banner photo, so it stays readable regardless of the photo underneath.
- Added a "Guest Food & Beverage Menu" title centered just below the banner.
- Updated the restaurant display name to "Gaia Lake - Kandalama" (the fresh-install default; on the live site this is controlled by Admin → Profile → Restaurant Name).
- Added this WhatsNew.md file and a "What's New" panel in Admin → Settings, showing the latest version, date, and a short update note.
