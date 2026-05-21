import type { MockSummary } from "@/types";

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);
}

export function generateSimpleSummary(text: string): MockSummary {
  const parts = sentences(text);
  const trimmed = text.trim();

  const shortSummary =
    parts.slice(0, 2).join(" ") ||
    (trimmed.length > 160 ? `${trimmed.slice(0, 157)}…` : trimmed);

  const keyPoints = parts
    .slice(0, 5)
    .map((s) => (s.length > 120 ? `${s.slice(0, 117)}…` : s));

  const actionPatterns =
    /\b(should|must|need to|action item|todo|follow up|by (monday|tuesday|wednesday|thursday|friday|next week|friday)|schedule|finalize|sync with)\b/i;

  let actionItems = parts.filter((s) => actionPatterns.test(s)).slice(0, 4);

  if (actionItems.length === 0 && parts.length > 0) {
    actionItems = [parts[parts.length - 1]].map((s) =>
      s.length > 100 ? `${s.slice(0, 97)}…` : s
    );
  }

  return {
    shortSummary,
    keyPoints: keyPoints.length > 0 ? keyPoints : [shortSummary],
    actionItems:
      actionItems.length > 0
        ? actionItems
        : ["Review transcript and export as needed."],
  };
}
