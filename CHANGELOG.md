# Changelog

## 2025-11-20 – Compact mobile header

- Tightened the header nav pill spacing, padding, and layout on phones so the buttons stay in a single line without inflating the sticky header height.
- Completed a final polish pass after reviewing the project to ensure the UI, translations, and layout structure remain consistent across breakpoints.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-19 – Smooth summary empty state

- Softened the empty-state summary card fill/border mix and swapped in a low-contrast glow so its rounded corners no longer show black halos against the page background.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-19 – Polish Today block and filters

- Blended the Today hero card surface into the page background, tightened its glow inside the border, and kept the parity highlight under a single layered gradient so there is no visible seam against the main canvas.
- Tuned the Today list surface mix so the rounded list area inherits the site background tone, eliminating the leftover color mismatch around the pair list corners.
- Softened the empty-state summary card fill/border so its rectangle fades into the page background without dark bands.
- Matched the Tomorrow card container to the page background mix so the pair list’s rounded corners no longer show dark seams.
- Rebuilt subgroup badges plus filter pills around shared tone variables so subgroup/type/day options now carry meaningful colors that stay consistent across chips and the filter panel.
- Restacked the collapsible heading caption on phones so the date label wraps under “Сегодня/Завтра” with mobile-friendly spacing instead of cramming beside the title.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-18 – Keep countdown with first pair

- Embedded the first-pair summary inside the Today card alongside the countdown, removed the standalone banner, and tweaked the inline timer style so the pre-class state reads as a single section.
- Rebalanced the collapsible Today/Tomorrow headers with consistent padding, borders, and hover states so their highlight area no longer jumps between collapsed and expanded layouts.
- Gave the header anchor pills a softer focus treatment and pause the auto-hide logic after nav clicks so the header stays visible when following the in-page links.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-17 – Lock Russian locale and unify controls

- Removed the language toggle, stripped the unused English dictionary, and now always hydrate the UI plus `<html lang>` with Russian so visitors are not prompted to switch languages.
- Replaced the orphaned footer globe control with a labeled theme switch pill so the remaining action clearly communicates its purpose and fits the existing pill motif.
- Restyled type chips, subgroup badges, status pills, and the countdown progress bar to reuse shared theme tokens instead of ad-hoc hex colors, giving the schedule a single visual language in both light and dark themes.

### Verification

- Manual QA: not run (CLI environment)

# Changelog

## 2025-11-15 – Separate countdown and tidy collapsibles

- Pulled the next-class countdown (and in-progress progress bar) into its own banner so “Сегодня” reads cleanly while the timer stays visible above the sections.
- Reworked the collapsible headers with softer backgrounds, a balanced chevron icon, and hover states so the Today/Tomorrow cards no longer look broken when collapsed.
- Kept the timer banner visually aligned with the rest of the schedule card stack for a single cohesive look across the page.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-15 – Streamline weekly navigation

- Trimmed the header nav down to Today/Tomorrow/Week schedule anchors with minimalist pill styling and renamed the week section to “Расписание на неделю”/“Week schedule”.
- Removed the Speakers/FAQ/Contacts sections and relocated the subgroup/day/type filters plus parity switch directly above the weekly schedule for tighter context.
- Restyled the Today/Tomorrow collapsible headers with a softer card treatment and a clean chevron icon so the collapsed state feels more inviting to expand.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-15 – Simplify navigation and filters layout

- Rebuilt the header into a light navigation bar with section anchors so only the schedule links (Schedule/Speakers/FAQ/Contacts) remain above the fold while the brand meta stays compact.
- Moved the parity switch and subgroup/day/type filters into a dedicated card directly above the schedule, removed the old drawer toggle, and restyled the chips/reset action to match the minimalist typography spacing.
- Added informational sections for speakers, the FAQ blurb, and contact guidance so the new navigation has visible targets in both languages.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-16 – Clickable day headers with animation

- Removed the separate “Expand/Hide” buttons so the Today and Tomorrow headings themselves now behave as the toggles, keeping the layout cleaner and matching the requested interaction.
- Added a shared collapsible region helper plus CSS transitions so both sections smoothly expand/collapse while respecting system reduced-motion preferences.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-15 – Switch to Inter and highlight section toggles

- Replaced the Google Fonts import and global font stack so the entire UI now renders with the Inter family and consistent fallbacks.
- Updated the Today/Tomorrow toggle strings to read “Расширить” when collapsed (English: “Expand”) and refreshed the buttons with higher-contrast accent styling so they are easier to spot.
- Gave the toggle caret and hover states more lift plus ensured the active state still contrasts against the content cards.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-15 – Switch UI font to Poppins

- Replaced the Google Fonts import and global font stack so the entire schedule now renders with the Poppins family for a more rounded look.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-14 – Polish section toggles and filters drawer

- Forced the Manrope stack on all native form controls so header buttons and filter chips no longer fall back to system fonts.
- Restyled the “Show Today” / “Show Tomorrow” toggles with pill-shaped surfaces, accent-active states, and smoother hover/press transitions to match the rest of the UI.
- Rounded and lifted the filters drawer container so its shadow is no longer clipped and the panel feels consistent with other cards.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-14 – Scroll filters into view

- Ensure opening the filters button while scrolled down reveals the header area by automatically scrolling the toggle into view and honoring reduced-motion preferences.
- Keep the auto-hide header visible when the filters expand, preventing the perception that the filters failed to open.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-14 – Rebuild responsive icon bundle

- Added `scripts/generate_icons.py` to regenerate icons with bilinear scaling and smooth rounded corners directly from `icon.png`.
- Recreated multi-size PNG variants (16–1024px), favicon-targeted PNGs, app icon, Apple touch icon, and a multi-resolution `favicon.ico`, all under `icons/`, plus pointed `<link rel="icon">` at the relocated bundle.

### Verification

- Manual QA: not run (asset generation in CLI environment)

## 2025-11-14 – Load Manrope from Google Fonts

- Linked the document head to Google Fonts with preconnect hints so the Manrope family loads consistently for all declared weights.

### Verification

- Manual QA: not run (CLI environment)

## 2025-11-14 – Clarify subgroup badges and countdown label

- Added localized "1st subgroup" / "2nd subgroup" text to the subgroup chips so cards no longer show lone digits.
- Restyled the "Before start" countdown label into a compact pill stacked above the timer to keep the prefix readable on all screens.
- Removed the live Moscow date/time line from the header hero to reduce visual noise above the filters.

### Verification

- Manual QA: not run (CLI environment)

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
