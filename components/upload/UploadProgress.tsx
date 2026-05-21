"use client";

import { motion } from "framer-motion";
import { Check, FileAudio, Upload } from "lucide-react";
import { formatFileSize } from "@/lib/validation";
import { GlassCard } from "@/components/ui/GlassCard";

interface UploadProgressProps {
  progress: number;
  fileName: string;
  fileSize: number;
}

export function UploadProgress({
  progress,
  fileName,
  fileSize,
}: UploadProgressProps) {
  const complete = progress >= 100;

  return (
    <GlassCard
      variant="sheet"
      hover={false}
      className="mx-auto max-w-3xl ring-quiet"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          {complete ? "Ready" : "Uploading"}
        </span>
        <span className="tabular-nums text-[13px] font-medium text-zinc-300">
          {progress}
          <span className="text-zinc-500">%</span>
        </span>
      </div>

      <div className="flex items-start gap-4">
        <div className="icon-glass h-12 w-12 shrink-0">
          {complete ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Check className="h-5 w-5 text-emerald-400" />
            </motion.div>
          ) : (
            <Upload className="h-5 w-5 text-violet-200" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="glass-inner flex items-center gap-3 p-3">
            <FileAudio className="h-4 w-4 shrink-0 text-zinc-400" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-white">
                {fileName}
              </p>
              <p className="text-[11px] text-zinc-500">
                {formatFileSize(fileSize)}
              </p>
            </div>
          </div>

          <div className="mt-4 progress-pill">
            <motion.div
              className="progress-pill-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
            />
          </div>

          <p className="mt-2.5 text-[12px] text-zinc-500">
            {complete ? (
              <span className="text-emerald-300/90">
                Upload complete — starting AI pipeline…
              </span>
            ) : (
              "Securing your file…"
            )}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
