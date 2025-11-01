# Changelog

## 2025-11-05 – End-of-class countdown

- Added countdown-to-end timer for the active class with shared formatting, accessibility text, and parity-aware progress.
- Localised new countdown strings in Russian and English; factored reusable timer utilities for shared use.
- Introduced lightweight unit and snapshot tests covering countdown formatting behaviour.

### Verification

- `node tests/countdown-utils.test.js`
- Manual QA: not run (CLI environment)

## 2025-11-02 – Simplify header and filters layout

- Made the header static with auto-hide behaviour, removed manual collapse controls, and kept week parity toggles alongside a new filters button.
- Moved subgroup/day/type filters into a collapsible panel beneath the header with active-state indicators and persistence of filter logic.
- Relocated the language selector to a globe-accented footer, streamlined footer content, and reduced global side padding for a lighter layout.

### Verification

- Manual QA: not run (CLI environment)

## 2025-10-31 – Final Polish

- Added bilingual UI with persistent language toggle, updated copy, and document `lang` syncing.
- Persisted class-type filter, rebuilt filter groups from translation dictionaries, and refreshed button accessibility.
- Hardened runtime with an error boundary fallback, cached Moscow time formatter, and pinned CDN dependencies.
- Extended styling with shared toggle styles, reduced-motion safeguards, and error fallback visuals.
- Documented project usage, manual QA checklist, and formatting conventions; introduced `.editorconfig`.

### Verification

Manual validation recommended on `http://localhost:5173`:

1. Switch language, parity, subgroup, type, and day filters; reload to confirm persistence.
2. Cycle theme modes and ensure current class progress, reduced-motion preference, and focus rings behave correctly.
3. Navigate via footer anchors; open the university link and confirm it uses `noopener noreferrer`.
4. Toggle to English and verify headings, filter labels, and footer text update.
5. Check browser console for warnings or network errors (none expected).
