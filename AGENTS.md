# Repository Guidelines

## Project Structure & Module Organization
- `index.html` bootstraps the SPA, pins CDN React/Babel versions, and mounts `app.jsx`.
- `app.jsx` stores schedule arrays, hook helpers, and translation dictionaries; keep related helpers adjacent to their consumers and maintain schedule object key order (`day`, `pair`, `time`, etc.).
- `styles.css` centralizes theme tokens, responsive layout rules, and reduced-motion guards—prefer existing CSS custom properties before adding new values.
- `favicon.ico` carries the tab icon; update alongside any branding or color changes.

## Build, Test, and Development Commands
- `npx serve . --listen 5173` launches the static dev server with auto reload on save; keep the port pinned so filter preferences persist.
- `python3 -m http.server 5173` offers a no-Node fallback when the `serve` CLI is unavailable.
- `npm install --global serve` installs the CLI once per machine; no other build tooling is required.

## Coding Style & Naming Conventions
- Follow `.editorconfig`: LF endings, UTF-8, two-space indentation, and trailing semicolons in JSX files. Use single quotes inside schedule objects.
- Keep CSS class names kebab-case, reuse theme custom properties, and avoid hard-coded colors.
- Introduce new UI strings in both language dictionaries and access them through `useTranslation()` helper bindings to avoid divergent text.

## Testing Guidelines
- No automated suite exists; perform a manual pass before merging.
- Verify parity toggles (`Авто`, `Все`, `Нечётная`, `Чётная`), subgroup filters, class-type filters, weekday selectors, and theme switching (System → Light → Dark) in both languages.
- Refresh the page to confirm persistence of selected filters and watch the browser console for React or accessibility warnings; treat any new warning as a blocker and document findings.

## Commit & Pull Request Guidelines
- Use short, imperative commits modeled on the existing log (e.g., “Add language toggle to header”) and update `CHANGELOG.md` with every user-visible change plus the manual QA performed.
- Pull requests should summarize the change set, link tracking issues when available, and include screenshots or GIFs for UI updates; call out localization impacts and note whether filters or persistence logic need special review.

## Localization & Content Updates
- Mirror schedule edits across odd/even arrays, keep subgroup and class-type labels aligned, and audit ARIA labels when content changes so screen readers remain accurate.
- Provide English and Russian strings together and confirm the dictionaries stay in sync whenever new keys are introduced.
