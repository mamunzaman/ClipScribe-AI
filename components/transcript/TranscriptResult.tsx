"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Globe,
  Hash,
  RotateCcw,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { TranscriptResult as TranscriptResultType } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { TranscriptActions } from "./TranscriptActions";
import { MockSummaryPanel } from "./MockSummary";

interface TranscriptResultViewProps {
  result: TranscriptResultType;
  onReset: () => void;
}

interface TranscriptLine {
  time: string | null;
  text: string;
}

function parseTranscript(text: string): TranscriptLine[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*(.*)$/);
      if (m) return { time: m[1], text: m[2] };
      return { time: null, text: line };
    });
}

function MetaPill({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11.5px] text-zinc-400 backdrop-blur-sm">
      <Icon className="h-3 w-3 text-zinc-500" />
      {label}
    </span>
  );
}

export function TranscriptResultView({
  result,
  onReset,
}: TranscriptResultViewProps) {
  const downloadName = `${result.title
    .replace(/\s+/g, "-")
    .toLowerCase()}-transcript.txt`;
  const lines = parseTranscript(result.text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-4xl space-y-4 pb-16 sm:space-y-5 sm:pb-20"
    >
      {/* Editorial header */}
      <div className="glass-float overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="chip">
                <Sparkles className="h-3 w-3 text-violet-300" />
                Ready
              </span>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500">
                Transcript
              </span>
            </div>
            <h1 className="mt-3 truncate text-[22px] font-semibold tracking-tight text-white sm:text-[26px]">
              {result.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <MetaPill icon={Globe} label={result.language} />
              <MetaPill icon={Clock} label={result.duration} />
              <MetaPill
                icon={Hash}
                label={`${result.wordCount.toLocaleString()} words`}
              />
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onReset}
            className="shrink-0 self-start"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New transcription
          </Button>
        </div>
      </div>

      <TranscriptActions text={result.text} downloadFilename={downloadName} />

      <MockSummaryPanel summary={result.summary} />

      {/* Transcript workspace */}
      <GlassCard
        variant="sheet"
        hover={false}
        noPad
        className="overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-white/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Full transcript
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:inline-block" />
            <span className="hidden text-[11.5px] text-zinc-500 sm:inline-block">
              {lines.length} lines · {result.duration}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[12px] text-zinc-500">
              <Search className="h-3 w-3" />
              <span>Search transcript</span>
              <span className="ml-2 hidden rounded border border-white/10 px-1 font-mono text-[10px] text-zinc-500 sm:inline-block">
                /
              </span>
            </div>
          </div>
        </div>

        {/* Transcript scroll area with timestamp lane */}
        <div className="transcript-scroll">
          <ul className="divide-y divide-white/[0.04] px-1.5 py-1.5 sm:px-3 sm:py-2">
            {lines.map((line, i) => (
              <li
                key={i}
                className="group grid grid-cols-[56px_1fr] gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.02] sm:grid-cols-[72px_1fr] sm:gap-5 sm:px-4 sm:py-3.5"
              >
                <div className="pt-[3px]">
                  <span
                    className={`font-mono text-[10.5px] tracking-tight ${
                      line.time ? "text-zinc-500" : "text-transparent"
                    }`}
                  >
                    {line.time ?? "—"}
                  </span>
                </div>
                <p className="text-[13.5px] leading-[1.7] text-zinc-200 sm:text-[14px]">
                  {line.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3 text-[11px] text-zinc-500">
          <span>End of transcript</span>
          <span className="font-mono">{result.duration}</span>
        </div>
      </GlassCard>
    </motion.div>
  );
}
