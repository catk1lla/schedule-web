# Repository Guidelines

## Project Structure & Module Organization
Keep `index.html` lean; it mounts React 18 via CDN, loads Babel for inline JSX, and should only reference additional scripts with `type="text/babel"`. Core logic lives in `app.jsx`, which houses `SCHEDULE_ODD`, `SCHEDULE_EVEN`, hooks, and UI components; keep helpers near the top-level hooks for discoverability. Global design tokens, responsive tweaks, and layout rules belong in `styles.css`; extend existing CSS variables before adding new colors.

## Build, Test, and Development Commands
Serve the app locally with `npx serve . --listen 5173` for live-reload friendly caching, or run `python3 -m http.server 5173` for a zero-dependency alternative. After edits, hard-refresh the browser so Babel recompiles inline JSX and surfaces console warnings. No bundling step currently exists; the project relies on the CDN-delivered React runtime.

## Coding Style & Naming Conventions
Use two-space indentation, retain trailing semicolons, and prefer single quotes within data arrays. Follow `PascalCase` for React components, `camelCase` for hooks and helpers, and reserve `UPPER_SNAKE_CASE` for shared constants such as filter options. Mirror existing object property order (`day`, `pair`, `time`, etc.) to keep diffs readable. Match surrounding JSX formatting and keep new comments purposeful—only where logic is non-obvious.

## Testing Guidelines
Manual verification only: open `http://localhost:5173`, toggle parity modes (`Авто`, `Чёт`, `Нечёт`, `Все`), switch themes, and apply each filter group to confirm state persistence across reloads. Review subgroup-specific entries and week-specific notes for accuracy. Check the browser console for React warnings about keys or hook dependencies and treat any new warning as a blocker.

## Commit & Pull Request Guidelines
Commits follow short, imperative statements (e.g., “Refine widescreen week layout”) and should cover a single logical change. Pull requests must describe UX-visible updates, mention any data range adjustments, and include before/after visuals when layout changes. Reference related issues or discussions and list manual test steps so reviewers can reproduce verification quickly.
