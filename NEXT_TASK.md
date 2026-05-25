# Next Task

## Current goal

Deploy to Vercel: set all env vars from `.env.local.example`, then verify 2 min MP4 clips and transcribes on production.

## Client download audit (2026-05-21) — DONE

- Transcript `.txt` download is Blob-only; API returns JSON text only
- FFmpeg temps stay in `os.tmpdir()` with `finally` cleanup

**Verify next:** Production upload after deploy; test Download .txt and Copy on result screen.
