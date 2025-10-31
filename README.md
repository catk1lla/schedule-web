# Schedule Web

> Полная документация на русском: см. `README.ru.md`.

Adaptive single-page schedule viewer for alternating parity weeks. The app runs directly in the browser via the CDN-hosted React 18 runtime and uses inline Babel compilation for JSX. It keeps a compact footprint while offering persistent filters, theme controls, and multilingual UI copy.

## Highlights

- 📅 Odd/even week awareness with automatic Moscow time detection and memoised date handling.
- 🎯 Persistent filters for subgroup, class type, and day with keyboard-friendly controls.
- 🎨 System/Light/Dark theme cycle, animated current class state, and responsive layout down to small screens.
- 🌐 Bilingual interface (Russian/English) with quick language toggle and document `lang` updates.
- ♿ Accessibility passes: focus-visible styling, descriptive ARIA labels, reduced-motion handling, and error boundary fallback.

## Quick Start

1. Install a simple static server if you do not already have one:
   ```bash
   npm install --global serve
   ```

2. From the repository root, launch either of the recommended servers:
   ```bash
   npx serve . --listen 5173
   # or
   python3 -m http.server 5173
   ```

3. Open `http://localhost:5173` in a modern browser and hard-refresh after edits so Babel recompiles the inline JSX.

## Project Layout

- `index.html` – Minimal bootstrap that links React/ReactDOM/Babel from pinned CDN versions and mounts `app.jsx`.
- `app.jsx` – Schedule data, React hooks, translation tables, and UI components.
- `styles.css` – Theme tokens, layout rules, and responsive behaviour.
- `.editorconfig` – Shared formatting baseline (LF endings, 2-space indents).
- `CHANGELOG.md` – Release notes and verification checklist.

## Development Notes

- Keep helper functions close to the top-level hooks in `app.jsx`.
- When editing data arrays, preserve property order (`day`, `pair`, `time`, …) for easier diffs.
- Use single quotes inside schedule data; maintain trailing semicolons and two-space indentation.
- New UI text should be added to both language dictionaries (`TRANSLATIONS`) and referenced through `useTranslation()`.
- For accessibility changes, audit keyboard navigation and screen-reader labels; any new animation must respect `prefers-reduced-motion`.

## Manual QA Checklist

After changes, confirm the following in both languages:

1. Toggle parity (`Авто`, `Все`, `Нечётная`, `Чётная`) and ensure the list updates.
2. Switch subgroups, class types, and weekdays; reload the page to verify filter persistence.
3. Cycle interface theme (System → Light → Dark) and check the URL hash navigation from the footer.
4. Switch themes and language on mobile and desktop viewports.
5. Inspect the console for React warnings—treat any new warning as a blocker.

## Contributing

Please update the changelog with every user-visible change and document manual test steps in pull requests. Keep commits focused with short, imperative messages (e.g., “Add language toggle to header”).
