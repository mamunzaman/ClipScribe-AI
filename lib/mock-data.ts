import type { TranscriptResult } from "@/types";

export function generateMockTranscript(filename: string): TranscriptResult {
  const base = filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");

  return {
    title: base || "Untitled Recording",
    language: "English (US)",
    duration: "12:34",
    wordCount: 1847,
    text: `[00:00] Welcome everyone to today's session. We're going to walk through the product roadmap and discuss priorities for the next quarter.

[00:42] First, let's talk about user feedback. We've received over two hundred responses in the past month, and the top request is faster transcription turnaround.

[01:15] The engineering team has been prototyping a new pipeline that reduces processing time by roughly forty percent without sacrificing accuracy.

[02:03] On the design side, we're refining the upload experience — drag and drop, clearer progress states, and a transcript view that feels as polished as the rest of the product.

[03:28] For go-to-market, we want to position ClipScribe as the premium choice for creators, podcasters, and teams who need reliable transcripts without complexity.

[04:55] Action items: finalize the beta timeline by Friday, sync with legal on data retention copy, and schedule user interviews with five power users next week.

[06:12] Any questions before we wrap? Great — thanks everyone, and I'll share the recording notes in Slack.`,
    summary: {
      shortSummary:
        "A quarterly planning session covering transcription performance, UX improvements, and go-to-market positioning for ClipScribe AI.",
      keyPoints: [
        "Users want faster transcription; new pipeline targets ~40% speed improvement",
        "Upload UX and transcript polish are active design priorities",
        "Positioning targets creators, podcasters, and teams needing reliable transcripts",
        "Beta timeline, legal copy, and user interviews are upcoming milestones",
      ],
      actionItems: [
        "Finalize beta timeline by Friday",
        "Sync with legal on data retention messaging",
        "Schedule interviews with five power users",
        "Share recording notes in Slack",
      ],
    },
  };
}
