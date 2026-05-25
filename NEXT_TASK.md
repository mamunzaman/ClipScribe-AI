# Next Task

## Current goal

Deploy to Vercel with env vars (include `NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB=4`); verify upload under 4 MB and 413-safe errors.

## Upload size + 413 handling (2026-05-21) — DONE

- Client blocks files > 4 MB before `/api/transcribe`
- Safe JSON parse; dedicated 413 error message

**Verify next:** Production upload of small MP4; oversized file shows in-card error without API call.
