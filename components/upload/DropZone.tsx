"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AudioLines,
  CloudUpload,
  FileVideo,
  Languages,
  Sparkles,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { DragEvent } from "react";
import { ACCEPTED_EXTENSIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  error: string | null;
  disabled?: boolean;
}

function MiniWaveform() {
  const heights = [4, 8, 5, 11, 6, 9, 4, 10, 7, 5, 12, 6, 8, 5, 9, 4, 7];
  return (
    <div className="flex h-6 items-end gap-[3px]" aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          style={{
            height: `${h * 2}px`,
            animationDelay: `${(i * 0.09).toFixed(2)}s`,
            animationDuration: `${(1.1 + (i % 4) * 0.15).toFixed(2)}s`,
          }}
          className="waveform-bar w-[2px] rounded-full bg-white/25"
        />
      ))}
    </div>
  );
}

export function DropZone({ onFileSelect, error, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      dragDepthRef.current += 1;
      setIsDragging(true);
    },
    [disabled]
  );

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      dragDepthRef.current = 0;
      setIsDragging(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  return (
    <div id="upload" className="mx-auto max-w-3xl">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-[13px] font-medium uppercase tracking-[0.18em] text-zinc-500">
          Upload
        </h2>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="chip">
            <Sparkles className="h-3 w-3 text-violet-300" />
            Whisper-v3 (mock)
          </span>
          <span className="chip">
            <Languages className="h-3 w-3" />
            auto
          </span>
        </div>
      </div>

      <motion.div
        onDragEnter={onDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        animate={{ scale: isDragging ? 1.005 : 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "group glass-sheet relative cursor-pointer overflow-hidden p-5 transition-colors duration-500 sm:p-7",
          isDragging ? "ring-active border-violet-400/30" : "ring-quiet",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
        />

          <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-6">
          <motion.div
            animate={{ y: isDragging ? -2 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "icon-glass mx-auto h-14 w-14 transition-colors duration-500 sm:mx-0 sm:h-16 sm:w-16",
              isDragging &&
                "border-violet-400/30 from-violet-400/20 to-violet-600/10"
            )}
          >
            {isDragging ? (
              <CloudUpload className="h-6 w-6 text-violet-200" />
            ) : (
              <FileVideo className="h-6 w-6 text-zinc-300" />
            )}
          </motion.div>

          <div className="text-center sm:text-left">
            <h3 className="text-[16px] font-semibold tracking-tight text-white sm:text-[18px]">
              {isDragging ? "Release to upload" : "Drop a clip to transcribe"}
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
              Drag & drop, or click to browse. Up to 500 MB.
            </p>

            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1 sm:justify-start">
              {ACCEPTED_EXTENSIONS.map((ext) => (
                <span key={ext} className="chip font-mono text-[10px] uppercase">
                  {ext.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Metadata telemetry lane */}
        <div className="mt-5 grid gap-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/30 sm:mt-6 sm:grid-cols-3 sm:divide-x sm:divide-white/[0.05]">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-zinc-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400/80" />
              </span>
              Signal
            </div>
            <MiniWaveform />
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.05] px-4 py-3 sm:border-t-0">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500">
              Model
            </span>
            <span className="text-[11.5px] text-zinc-300">whisper-v3</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.05] px-4 py-3 sm:border-t-0">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500">
              ETA
            </span>
            <span className="tabular-nums text-[11.5px] text-zinc-300">~00:45</span>
          </div>
        </div>

        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pointer-events-none absolute inset-2 rounded-[26px] border border-dashed border-violet-300/40"
          />
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-3 flex items-center gap-2.5 rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-[13px] text-red-200 backdrop-blur-xl"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
