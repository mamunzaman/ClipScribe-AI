# Next Task

## Current goal

Wire real transcription API into `useTranscriptionFlow` (replace mock upload/processing).

## Portfolio screenshots (2026-05-21) — DONE

`npm run screenshots` → `docs/screenshots/` (5 PNGs, Playwright + `next start`, verified non-blank).

---

## Final Premium Polish (2026-05-21) — PASS

**Build:** `npm run build` — success, no lint errors

### Changes this pass

| Area | Change |
|------|--------|
| Hero dashboard card | Compressed to `p-3.5`, tighter inner cards, 4 transcript lines, toolbar row, live pulse dot on status, `~00:18 left` ETA |
| Waveform in hero | `originY: 1` so bars animate from bottom up, not center |
| Feature grid | `sm:grid-cols-4`: anchor card `col-span-2` with meta row, compact utility card with ETA row |
| DropZone MiniWaveform | CSS `waveform-pulse` animation with staggered `animation-delay` per bar |
| DropZone Signal label | Ping dot (live indicator) next to "Signal" |
| DropZone layout | `p-5 sm:p-7` (was sm:p-8), icon `h-14/h-16`, metadata lane uses `py-3` rows |
| `globals.css` | `@keyframes waveform-pulse` (opacity + scaleY from bottom), `chip` gap/letter-spacing, `btn-primary` cubic-bezier, `btn-ghost` hover shadow, `glass-card-hover` cubic-bezier |

---

## QA + UI Repair (2026-05-21) — PASS

**Build:** `npm run build` — success, no lint errors

### UI fixes applied this pass

| Issue | Fix |
|-------|-----|
| Feature bento 3rd card too narrow (`lg:col-span-1`) | Replaced 6-col asymmetric bento with clean equal `sm:grid-cols-3` |
| Hero preview overflowed on mobile | Hidden below `md` with `hidden md:block`; floating chips moved to `lg:flex` |
| Floating chips overflowed viewport | Changed `-left-2/-right-2` → `-left-8/-right-8`, `md:flex` → `lg:flex` |
| `!p-0` Tailwind override unreliable | Added `noPad` prop to `GlassCard`; `MockSummary` uses raw `div` so no change needed |
| Headline too large on tablet | Reduced: `3.25rem` → `3rem` at lg, softer scaling |
| `glass-widget::before` z-stacking | Restricted pseudo height to 50%, added `z-index: 0/1` to preserve inner content |
| Transcript viewer max width too wide | `max-w-5xl` → `max-w-4xl` |
| Transcript scroll height aggressive | `60vh` → `58vh` |
| Footer too much space | `py-10` → `py-8`, border softened |
| `chip !text-[10px]` fragile overrides | Replaced with explicit inline spans in Hero |
| `overflow-x` on html/body | Already present from previous QA pass |

### Manual check recommended
- 390px: hero stacks cleanly, upload card compact, flow works
- 1440px: asymmetric hero visible, bento equal 3 columns, transcript columns aligned

---

**Next step:** Wire real transcription API (screenshots done in `docs/screenshots/`)

**Screenshots:** `npm run screenshots` after `npm run build` into `useTranscriptionFlow`:
- Replace `simulateUpload` / `simulateProcessing` with real Whisper API calls
- Keep all views, progress states, and mock transcript structure intact
- Backend: Next.js API route or server action to call OpenAI/Whisper
