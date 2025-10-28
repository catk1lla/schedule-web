# Repository Guidelines

## Project Structure & Module Organization
- `index.html` is a static entry point that mounts React 18 from the CDN, wires in Babel for JSX in the browser, and should stay minimal; add new scripts via `type="text/babel"` modules.
- `app.jsx` contains both the schedule data (`SCHEDULE_ODD`, `SCHEDULE_EVEN`) and the React components that render filters, theming controls, and schedule cards; keep shared helpers near the top-level hooks for ease of discovery.
- `styles.css` defines the light/dark design tokens, layout rules, and responsive tweaks; prefer extending existing CSS variables before introducing new colors.

## Build, Test, and Development Commands
- `npx serve . --listen 5173` serves the static bundle with live reload-friendly caching; any lightweight static server works as long as it preserves relative paths.
- `python3 -m http.server 5173` offers a zero-dependency alternative for quick manual verification.
- After changes, always hard-refresh the browser to ensure Babel recompiles the inline JSX and to surface console warnings.

## Coding Style & Naming Conventions
- Follow the existing two-space indentation, trailing semicolons, and single quotes in data arrays; match JSX formatting to the surrounding blocks.
- Use `PascalCase` for React components and `camelCase` for hooks/helpers; reserve `UPPER_SNAKE_CASE` for shared constants such as filter option lists.
- When adding filters or schedule fields, mirror the existing object property order (`day`, `pair`, `time`, …) to keep diffs legible.

## Testing Guidelines
- No automated test harness exists; validate manually by loading `http://localhost:5173`, toggling parity modes (`Авто`, `Чёт`, `Нечёт`, `Все`), switching themes, and applying each filter group to confirm state persistence across reloads.
- Use the browser console to check for React warnings about keys or effect dependencies; treat any new warning as a blocker.
- Regression-test both Russian locale strings and subgroup-specific entries, ensuring week-specific notes still render.

## Commit & Pull Request Guidelines
- Commits in `git log` are short, imperative sentences (e.g., “Refine widescreen week layout”); follow that tone, keep scope tight, and prefer a single logical change per commit.
- Pull requests should describe UX-visible changes, mention updated data ranges, and include before/after screenshots or a GIF when the layout shifts.
- Reference issue IDs or discussion links when available, and list manual test steps so reviewers can reproduce the verification quickly.
