# ClipScribe AI — Project Status

**Last Update:** 2026-05-21 (demo password gate)

## Completed Features

- [x] Next.js 15 App Router + TypeScript + Tailwind
- [x] Premium glass UI (Base44 / iOS style)
- [x] Drag & drop upload (MP4, MOV, MP3, WAV)
- [x] Validation: **25 MB max**, **30 sec minimum**
- [x] OpenAI Whisper API + mock fallback
- [x] Upload → processing → transcript → copy/download/reset
- [x] **Demo password gate** (`DEMO_PASSWORD`, server-only, required each reload)
- [x] Session-memory unlock only + optional **Lock demo** (same visit)
- [x] Portfolio screenshots

## Demo access

1. Set `DEMO_PASSWORD` in `.env.local` (see `.env.local.example`)
2. Enter password each time you load or reload the site
3. **Lock demo** returns to the gate without reloading (same tab session)
4. Dev without `DEMO_PASSWORD`: gate bypassed automatically

## API Setup

- `OPENAI_API_KEY` — optional; mock transcript without it
- `DEMO_PASSWORD` — optional in dev; required for protected production demo

## Pending Tasks

- [ ] Deploy to Vercel (`OPENAI_API_KEY`, `DEMO_PASSWORD`)
- [ ] Speaker diarization
- [ ] Export SRT / VTT
