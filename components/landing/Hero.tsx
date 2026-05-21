"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  Check,
  FileAudio,
  Gauge,
  Languages,
  Mic2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: easeOut },
  };
}

function Waveform({ active = true }: { active?: boolean }) {
  const bars = [3, 6, 4, 9, 5, 8, 3, 7, 4, 10, 6, 4, 8, 5, 9, 6, 3, 7, 5, 4];
  return (
    <div className="flex h-6 items-end gap-[2.5px]">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          animate={active ? { scaleY: [0.45, 1, 0.55, 0.85, 0.5] } : { scaleY: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.045, ease: "easeInOut" }}
          style={{ height: `${h * 2}px`, originY: 1 }}
          className="w-[2px] rounded-full bg-gradient-to-t from-violet-500/50 to-violet-300/70"
        />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12">
      <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left column — editorial headline */}
        <div className="lg:col-span-7 lg:py-2">
          <motion.div
            {...fadeUp(0)}
            className="chip-strong w-fit"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
            </span>
            ClipScribe Studio · v1.0
          </motion.div>

          <motion.h1
            {...fadeUp(0.05)}
            className="mt-4 text-[2rem] font-semibold leading-[1.06] tracking-[-0.02em] text-white sm:text-[2.5rem] lg:text-[3rem]"
          >
            Studio-grade transcripts,
            <br className="hidden sm:block" />{" "}
            <span className="text-zinc-500">crafted from any clip.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.1)}
            className="mt-5 max-w-lg text-[15px] leading-relaxed text-zinc-400"
          >
            A focused AI workspace for turning audio and video into clean,
            timestamped text. Built for editors, researchers, and creators who
            care about detail.
          </motion.p>

          <motion.div
            {...fadeUp(0.15)}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <a
              href="#upload"
              className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
            >
              Start transcribing
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#features"
              className="btn-ghost inline-flex items-center gap-2 px-4 py-3 text-sm"
            >
              See how it works
            </a>
          </motion.div>

          <motion.div
            {...fadeUp(0.2)}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-zinc-500"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
              Local-first
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-zinc-400" />
              Sub-minute turnaround
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Languages className="h-3.5 w-3.5 text-zinc-400" />
              98 languages
            </span>
          </motion.div>
        </div>

        {/* Right column — app dashboard widget stack (hidden on mobile, shown md+) */}
        <motion.div
          {...fadeUp(0.18)}
          className="hidden md:block lg:col-span-5"
        >
          <div className="glass-sheet overflow-hidden p-3.5">
            {/* Window chrome */}
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-[5px]">
                  <span className="h-[9px] w-[9px] rounded-full bg-white/[0.09]" />
                  <span className="h-[9px] w-[9px] rounded-full bg-white/[0.09]" />
                  <span className="h-[9px] w-[9px] rounded-full bg-white/[0.09]" />
                </div>
                <span className="ml-1.5 text-[10.5px] font-medium text-zinc-600">
                  studio.clipscribe
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="h-[7px] w-[7px] rounded-full bg-emerald-400"
                />
                <span className="text-[10px] font-medium text-emerald-300/70">Live</span>
              </div>
            </div>

            {/* Now processing */}
            <div className="mt-3 rounded-xl border border-white/[0.05] bg-black/25 px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="icon-glass h-8 w-8 shrink-0 bg-gradient-to-b from-violet-400/25 to-violet-600/10">
                  <Mic2 className="h-3.5 w-3.5 text-violet-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium leading-tight text-white">
                    Roadmap-sync.mp3
                  </p>
                  <p className="text-[10px] text-zinc-600">12:34 · EN · 48 kHz</p>
                </div>
                <Waveform />
              </div>
              <div className="mt-2.5 progress-pill">
                <div className="progress-pill-fill" style={{ width: "68%" }} />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-600">
                <span>Processing speech · step 3/5</span>
                <span className="tabular-nums text-zinc-400">68%</span>
              </div>
            </div>

            {/* Transcript panel */}
            <div className="mt-2 overflow-hidden rounded-xl border border-white/[0.05] bg-black/25">
              <div className="flex items-center justify-between border-b border-white/[0.04] px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                    Transcript
                  </span>
                  <span className="h-2.5 w-px bg-white/[0.07]" />
                  <span className="text-[9.5px] text-zinc-700">12 seg</span>
                </div>
                <span className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[9px] font-medium text-zinc-600">
                  EN · clean
                </span>
              </div>
              <div className="divide-y divide-white/[0.03] px-3">
                {[
                  { t: "00:00", tx: "Welcome — walking through the roadmap.", muted: false },
                  { t: "00:42", tx: "Top request: faster turnaround on long files.", muted: false },
                  { t: "01:15", tx: "New pipeline cuts processing time by ~40%.", muted: true },
                  { t: "01:47", tx: "Q2 priorities: mobile SDK and export API.", muted: true },
                ].map(({ t, tx, muted }) => (
                  <div key={t} className="flex gap-2.5 py-[7px]">
                    <span className="w-8 shrink-0 pt-px font-mono text-[9.5px] text-zinc-700">{t}</span>
                    <p className={`text-[11px] leading-[1.5] ${muted ? "text-zinc-600" : "text-zinc-300"}`}>{tx}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status strip */}
            <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.04] pt-2.5 px-0.5">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-[9.5px] text-zinc-600">
                  <AudioLines className="h-2.5 w-2.5 text-violet-400/80" />
                  Audio extracted
                  <Check className="h-2 w-2 text-emerald-400/80" />
                </span>
                <span className="h-2.5 w-px bg-white/[0.07]" />
                <span className="inline-flex items-center gap-1 text-[9.5px] text-zinc-600">
                  <Sparkles className="h-2.5 w-2.5 text-zinc-500" />
                  Summary ready
                </span>
              </div>
              <span className="font-mono text-[9px] text-zinc-700">~00:18 left</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature row */}
      <div
        id="features"
        className="mt-14 grid gap-3 sm:mt-16 sm:grid-cols-4"
      >
        {/* Anchor card — wide */}
        <motion.div
          {...fadeUp(0.05)}
          className="glass-widget glass-card-hover p-5 sm:col-span-2"
        >
          <div className="icon-glass mb-4 h-9 w-9">
            <FileAudio className="h-[17px] w-[17px] text-violet-200/90" />
          </div>
          <h3 className="text-[14px] font-semibold tracking-tight text-white">
            Any format, zero setup
          </h3>
          <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-zinc-500">
            Drop in MP4, MOV, MP3, or WAV. Audio is extracted automatically — nothing preprocessed on your end.
          </p>
          <div className="mt-4 flex flex-wrap gap-1">
            {[".mp4", ".mov", ".mp3", ".wav"].map((e) => (
              <span key={e} className="chip font-mono text-[10px] uppercase">
                {e.slice(1)}
              </span>
            ))}
          </div>
          <div className="mt-4 border-t border-white/[0.05] pt-3.5">
            <p className="text-[11px] text-zinc-600">Up to 500 MB per file · No conversion needed</p>
          </div>
        </motion.div>

        {/* Standard card */}
        <motion.div
          {...fadeUp(0.1)}
          className="glass-widget glass-card-hover p-5 sm:col-span-1"
        >
          <div className="icon-glass mb-4 h-9 w-9">
            <Languages className="h-[17px] w-[17px] text-zinc-200" />
          </div>
          <h3 className="text-[14px] font-semibold tracking-tight text-white">
            Multilingual
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">
            Auto language detection. Clean punctuation and casing across 98 languages.
          </p>
        </motion.div>

        {/* Compact utility card */}
        <motion.div
          {...fadeUp(0.15)}
          className="glass-widget glass-card-hover flex flex-col justify-between p-4 sm:col-span-1"
        >
          <div>
            <div className="icon-glass mb-3.5 h-8 w-8">
              <Gauge className="h-[15px] w-[15px] text-zinc-200" />
            </div>
            <h3 className="text-[13.5px] font-semibold tracking-tight text-white">
              Fast pipeline
            </h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-500">
              Sub-minute turnaround on typical clips.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-600">Avg. ETA</span>
              <span className="font-mono tabular-nums text-zinc-400">~00:45</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
