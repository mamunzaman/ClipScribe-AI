"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { PROCESSING_STEPS } from "@/lib/constants";
import type { ProcessingStep } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";

interface ProcessingStepsProps {
  currentStep: ProcessingStep | null;
  completedSteps: ProcessingStep[];
  fileName: string;
}

export function ProcessingSteps({
  currentStep,
  completedSteps,
  fileName,
}: ProcessingStepsProps) {
  const total = PROCESSING_STEPS.length;
  const doneCount = completedSteps.length;
  const activeIndex = PROCESSING_STEPS.findIndex((s) => s.id === currentStep);
  const progressPct =
    currentStep === null && doneCount === total
      ? 100
      : Math.round(((doneCount + (activeIndex >= 0 ? 0.5 : 0)) / total) * 100);

  return (
    <GlassCard
      variant="sheet"
      hover={false}
      className="mx-auto max-w-3xl ring-quiet"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="chip">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
            </span>
            Processing
          </div>
          <h2 className="mt-3 text-[20px] font-semibold tracking-tight text-white sm:text-[22px]">
            Transcribing your clip
          </h2>
          <p className="mt-1 max-w-md truncate text-[12.5px] text-zinc-500">
            {fileName}
          </p>
        </div>

        <div className="text-right">
          <p className="tabular-nums text-[22px] font-semibold tracking-tight text-white">
            {progressPct}
            <span className="text-zinc-500">%</span>
          </p>
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            Step {Math.min(doneCount + 1, total)} / {total}
          </p>
        </div>
      </div>

      <div className="mt-4 progress-pill">
        <motion.div
          className="progress-pill-fill"
          animate={{ width: `${progressPct}%` }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
        />
      </div>

      <ul className="mt-6 divide-y divide-white/[0.05] rounded-2xl border border-white/[0.06] bg-black/20">
        {PROCESSING_STEPS.map((step, index) => {
          const done = completedSteps.includes(step.id);
          const active = currentStep === step.id;

          return (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.35 }}
              className={`flex items-center gap-4 px-4 py-3 transition-colors duration-300 ${
                active ? "bg-white/[0.03]" : ""
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                  done
                    ? "border-emerald-400/25 bg-emerald-500/15 text-emerald-300"
                    : active
                      ? "border-violet-400/30 bg-violet-500/15 text-violet-200"
                      : "border-white/[0.08] bg-white/[0.03] text-zinc-600"
                }`}
              >
                {done ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </motion.div>
                ) : active ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="font-mono text-[10.5px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[13.5px] font-medium tracking-tight ${
                    active || done ? "text-white" : "text-zinc-500"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11.5px] text-zinc-500">{step.description}</p>
              </div>
              {active && (
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400"
                />
              )}
              {done && (
                <span className="text-[11px] font-medium text-emerald-300/80">
                  done
                </span>
              )}
            </motion.li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
