# Next Task

## Current goal

Deploy to Vercel with `OPENAI_API_KEY` and `DEMO_PASSWORD` environment variables.

## Demo password gate (2026-05-21) — DONE

- `POST/GET /api/verify-password` — timing-safe compare, dev bypass when unset
- `DemoAccessShell` + `DemoPasswordGate` — glass UI, no flash before check
- Unlock in React state only — password required on every reload
- Header/footer **Lock demo** (in-session only)
- Removed `lib/demo-auth.ts` / localStorage persistence

**Verify next:** Production deploy; reload always shows gate; Lock demo works without reload.
