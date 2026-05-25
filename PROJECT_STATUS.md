# ClipScribe AI — Project Status

**Last Update:** 2026-05-21 (client-only transcript download audit)

## Completed Features

- [x] Premium glass UI + full transcription flow
- [x] OpenAI Whisper + mock fallback
- [x] Upload **max 5 min** (env `NEXT_PUBLIC_MAX_UPLOAD_DURATION_SECONDS`, default 300s)
- [x] Transcribe **first 30s only** (env `TRANSCRIBE_CLIP_SECONDS`, bundled `ffmpeg-static` before Whisper)
- [x] Demo password + Turnstile + access cookie
- [x] Portfolio screenshots
- [x] Vercel production config (`vercel.json`, Node API runtime, FFmpeg trace)
- [x] Transcript copy/download client-only (`Blob` + `revokeObjectURL`; no server `.txt` files)

## Demo media limits

| Limit | Env | Default |
|-------|-----|---------|
| Max upload duration | `NEXT_PUBLIC_MAX_UPLOAD_DURATION_SECONDS` | 300s (5 min) |
| Transcription clip | `TRANSCRIBE_CLIP_SECONDS` | 30s |

Uses bundled **`ffmpeg-static`** for clipping (no global FFmpeg install required). Temp files use `os.tmpdir()` only.

## Pending Tasks

- [ ] Deploy to Vercel (env vars set; verify 2 min MP4 on production)
- [ ] Speaker diarization
- [ ] Export SRT / VTT
