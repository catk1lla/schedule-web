# Repository Guidelines

## Project Structure & Module Organization
- `index.html` bootstraps the SPA, pins CDN React/Babel versions, and mounts `app.jsx`.
- `app.jsx` holds schedule data arrays, UI hooks, and translation dictionaries; keep helper hooks near their consumers.
- `styles.css` defines the theme tokens, responsive layout, and reduced-motion guards; reuse existing custom properties.
- `favicon.ico` ships the tab icon; update it alongside any branding tweaks.

## Build, Test, and Development Commands
- `npx serve . --listen 5173` launches a local static server with hot reload on save.
- `python3 -m http.server 5173` offers an alternative when Node.js is unavailable.
- `npm install --global serve` installs the Node CLI once; prefer pinned ports so saved filters persist across reloads.

## Coding Style & Naming Conventions
- Respect `.editorconfig`: LF endings, UTF-8, two-space indentation, trailing semicolons in JSX.
- Use single quotes for string literals inside schedule objects and maintain property order (`day`, `pair`, `time`, …) to keep diffs readable.
- New UI text must be added to both language dictionaries in `app.jsx`; reference keys through `useTranslation()` helpers.
- Keep CSS class names kebab-case and reuse existing CSS custom properties instead of hard-coded colors.

## Testing Guidelines
- No automated test suite exists; run a manual pass before merging.
- Verify parity toggles (`Авто`, `Все`, `Нечётная`, `Чётная`) update the list and survive reloads.
- Exercise subgroup, class-type, and weekday filters in both languages; confirm theme switching (System → Light → Dark) on desktop and mobile.
- Watch the browser console for React or accessibility warnings; treat any new warning as a blocker and document findings.

## Commit & Pull Request Guidelines
- Write short, imperative commit messages modelled on the existing log (`Add language toggle to header`).
- Update `CHANGELOG.md` with every user-visible change and note the manual QA you performed.
- Pull requests should describe the change set, link to tracking issues when available, and include screenshots or GIFs for UI updates.
- Highlight localisation impacts and note whether filters or persistence logic require special attention during review.

## Localization & Content Updates
- When editing schedule entries, mirror changes across odd/even arrays and keep subgroup/type labels consistent.
- Provide English and Russian strings together, and audit ARIA labels after content changes to ensure screen readers remain accurate.
