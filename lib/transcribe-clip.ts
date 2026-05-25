export const DEFAULT_TRANSCRIBE_CLIP_SECONDS = 30;

export function getTranscribeClipSeconds(): number {
  const raw = process.env.TRANSCRIBE_CLIP_SECONDS;
  const parsed = Number.parseInt(String(raw ?? ""), 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return DEFAULT_TRANSCRIBE_CLIP_SECONDS;
}
