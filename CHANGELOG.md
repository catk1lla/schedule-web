# Changelog

## 2025-11-14 – Polish hero meta and countdown

- Added the live Moscow date to the Today section header and mirrored Tomorrow’s caption treatment so the hero cards line up visually.
- Replaced the “auto detection” text with a parity pill that reuses odd/even colors and better communicates the current week at a glance.
- Split the countdown label into prefix/time/suffix parts and restyled the timer row so only the duration is highlighted, matching the rest of the UI accents.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-14 – Remove mobile footer gap

- Dropped the oversized bottom padding of `.app-shell` on phones and limited it to safe-area insets so the footer now sits flush with the viewport without a trailing blank strip.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-08 – Fix mobile countdown overflow

- Stacked the timer label and progress bar on narrow screens and allow the countdown text to wrap so the header content no longer stretches beyond the viewport when the timer is present.
- Relaxed the progress track width on phones to keep it fluid and prevent horizontal scrolling when the countdown renders.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-07 – Restore favicon bundle

- Recreated the `icons/` assets from the new `favicon.ico` and wired the document head to the regenerated PNG set.
- Dropped stale SVG mask links so browsers no longer fetch missing assets while keeping PWA manifest references intact.

### Verification

- Manual QA: not run (favicon asset wiring in CLI environment)

## 2025-11-06 – Refresh site icon

- Replaced the favicon set with a glassmorphism-inspired mark aligned to the schedule palette and regenerated 16–512px assets plus an SVG source.
- Added a PWA manifest with maskable icons, provided an Apple touch icon, and wired svg/png/ico links in the document head.
- Switched theme-color metadata to respect `prefers-color-scheme` for accurate browser chrome tinting.

### Verification

- Manual QA: not run (icon asset update in CLI environment)

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
