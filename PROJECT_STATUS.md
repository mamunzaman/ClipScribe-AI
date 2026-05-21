# ClipScribe AI — Project Status

**Last Update:** 2026-05-21 (Cloudflare Turnstile + demo access cookie)

## Completed Features

- [x] Premium glass UI + full transcription flow
- [x] OpenAI Whisper + mock fallback
- [x] Upload limits: 25 MB max, 30 sec minimum
- [x] **DEMO_PASSWORD** gate (password each reload, session UI only)
- [x] **Cloudflare Turnstile** on password screen
- [x] Signed **HttpOnly cookie** for `/api/transcribe` (1h, cleared on Lock demo)
- [x] `POST /api/lock-demo` clears access cookie

## Environment variables

| Variable | Required for |
|----------|----------------|
| `DEMO_PASSWORD` | Protected demo (prod) |
| `OPENAI_API_KEY` | Live Whisper |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile widget |
| `TURNSTILE_SECRET_KEY` | CAPTCHA verify + cookie signing |

## Pending Tasks

- [ ] Deploy to Vercel with all env vars
- [ ] Speaker diarization
- [ ] Export SRT / VTT
