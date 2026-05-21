# Next Task

## Current goal

Deploy to Vercel and add `OPENAI_API_KEY` in project environment settings.

## 25 MB limit alignment (2026-05-21) — DONE

- `MAX_FILE_SIZE_MB` → 25 in `lib/constants.ts`
- Validation message: *File must be 25 MB or smaller for live transcription.*
- UI copy updated (DropZone, Hero feature card)
- README / PROJECT_STATUS note Whisper 25 MB MVP limit

**Verify next:** Deploy with env var; test real clip under 25 MB on production URL.
