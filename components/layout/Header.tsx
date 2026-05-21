"use client";

import { motion } from "framer-motion";
import { useDemoAccess } from "@/components/auth/DemoAccessShell";
import { Command, Lock, Mic2 } from "lucide-react";

export function Header() {
  const { lockDemo } = useDemoAccess();
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#07070a]/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <a href="#" className="group flex items-center gap-2.5">
          <div className="icon-glass h-8 w-8 bg-gradient-to-b from-violet-400/30 to-violet-600/10 sm:h-9 sm:w-9">
            <Mic2 className="h-4 w-4 text-white sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white sm:text-base">
            ClipScribe <span className="text-zinc-500">/</span>{" "}
            <span className="text-zinc-400">AI</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-[13px] text-zinc-400 sm:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#upload" className="transition hover:text-white">
            Transcribe
          </a>
          <a href="#" className="transition hover:text-white">
            Docs
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={lockDemo}
            className="btn-ghost hidden items-center gap-1.5 px-3 py-1.5 text-[11px] sm:inline-flex"
          >
            <Lock className="h-3 w-3" />
            Lock demo
          </button>
          <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-zinc-400 backdrop-blur-xl">
            <Command className="h-3 w-3" />
            <span className="font-mono">K</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
