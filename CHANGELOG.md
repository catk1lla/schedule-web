# Changelog

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
