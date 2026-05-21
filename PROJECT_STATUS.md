# ClipScribe AI — Project Status

**Last Update:** 2026-05-21 (25 MB upload limit aligned with Whisper)

## Completed Features

- [x] Next.js 15 App Router + TypeScript + Tailwind
- [x] Premium dark landing page with hero & features
- [x] Drag & drop upload (MP4, MOV, MP3, WAV)
- [x] File validation — **max 25 MB** (OpenAI Whisper API limit for this MVP)
- [x] Upload progress animation
- [x] AI processing steps with parallel `/api/transcribe` call
- [x] OpenAI Whisper API (`whisper-1`) + mock fallback without API key
- [x] Transcript result, copy, download `.txt`, simple local summary
- [x] Glassmorphism UI, portfolio screenshots, QA + polish

## API Setup

1. Copy `.env.local.example` → `.env.local`
2. Set `OPENAI_API_KEY` from [OpenAI API keys](https://platform.openai.com/api-keys)
3. `npm run dev`

**OpenAI Whisper** supports files up to **25 MB** in this MVP. UI and validation enforce that limit.

## In Progress

- (none)

## Pending Tasks

- [ ] Deploy to Vercel with env var
- [ ] Speaker diarization
- [ ] Export SRT / VTT
