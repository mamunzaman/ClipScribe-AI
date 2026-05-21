"use client";

import { useDemoAccess } from "@/components/auth/DemoAccessShell";

export function Footer() {
  const { lockDemo } = useDemoAccess();

  return (
    <footer className="relative z-10 border-t border-white/[0.06] py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-500 sm:px-6">
        <p>ClipScribe AI — Portfolio demo · No data stored</p>
        <button
          type="button"
          onClick={lockDemo}
          className="mt-3 text-[12px] text-zinc-600 transition hover:text-zinc-300"
        >
          Lock demo
        </button>
      </div>
    </footer>
  );
}
