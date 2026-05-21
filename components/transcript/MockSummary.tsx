"use client";

import { motion } from "framer-motion";
import { CheckSquare, Lightbulb, ListChecks } from "lucide-react";
import type { MockSummary as MockSummaryType } from "@/types";

interface MockSummaryProps {
  summary: MockSummaryType;
}

const easeOut = [0.22, 1, 0.36, 1] as const;

export function MockSummaryPanel({ summary }: MockSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.45, ease: easeOut }}
      className="grid gap-3 lg:grid-cols-6"
    >
      {/* Summary — wide */}
      <div className="glass-widget p-5 lg:col-span-6">
        <div className="flex items-start gap-4">
          <div className="icon-glass h-10 w-10 shrink-0 bg-gradient-to-b from-amber-300/15 to-amber-500/5">
            <Lightbulb className="h-[18px] w-[18px] text-amber-200/90" />
          </div>
          <div className="min-w-0">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Summary
            </p>
            <p className="mt-1.5 text-[13.5px] leading-[1.65] text-zinc-300">
              {summary.shortSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Key points */}
      <div className="glass-widget p-5 lg:col-span-3">
        <div className="mb-3.5 flex items-center gap-2">
          <div className="icon-glass h-8 w-8">
            <ListChecks className="h-4 w-4 text-violet-200/90" />
          </div>
          <h3 className="text-[14px] font-semibold tracking-tight text-white">
            Key points
          </h3>
        </div>
        <ul className="space-y-2.5">
          {summary.keyPoints.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 text-[13px] leading-snug text-zinc-400"
            >
              <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-violet-400/80" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action items */}
      <div className="glass-widget p-5 lg:col-span-3">
        <div className="mb-3.5 flex items-center gap-2">
          <div className="icon-glass h-8 w-8">
            <CheckSquare className="h-4 w-4 text-emerald-200/90" />
          </div>
          <h3 className="text-[14px] font-semibold tracking-tight text-white">
            Action items
          </h3>
        </div>
        <ul className="space-y-1.5">
          {summary.actionItems.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.025] px-3 py-2.5 text-[12.5px] text-zinc-300"
            >
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] font-mono text-[10px] text-zinc-400">
                {i + 1}
              </span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
