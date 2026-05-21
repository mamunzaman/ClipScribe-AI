import type { TranscriptResult } from "@/types";
import { generateSimpleSummary } from "@/lib/summary";

function titleFromFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").trim();
  return base || "Untitled Recording";
}

function estimateDuration(wordCount: number): string {
  const totalSeconds = Math.max(1, Math.round((wordCount / 150) * 60));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function buildTranscriptResult(
  filename: string,
  transcript: string
): TranscriptResult {
  const text = transcript.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  return {
    title: titleFromFilename(filename),
    language: "Auto-detected",
    duration: estimateDuration(wordCount),
    wordCount,
    text,
    summary: generateSimpleSummary(text),
  };
}
