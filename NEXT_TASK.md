# Next Task

## Current goal

Deploy to Vercel with `DEMO_PASSWORD`, `OPENAI_API_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY`.

## Turnstile + access cookie (2026-05-21) — DONE

- Turnstile on `DemoPasswordGate`; verify via `/api/verify-password`
- Signed HttpOnly `clipscribe_demo_access` cookie (1h) after unlock
- `/api/transcribe` requires valid cookie when demo is protected
- `/api/lock-demo` clears cookie

**Verify next:** Production Turnstile keys; unlock → transcribe; reload shows gate; cookie still valid until expiry or Lock demo.
