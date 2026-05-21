"use client";

import { motion } from "framer-motion";
import { Lock, Mic2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface DemoPasswordGateProps {
  onUnlock: () => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

export function DemoPasswordGate({ onUnlock }: DemoPasswordGateProps) {
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const captchaRequired = Boolean(SITE_KEY);
  const canSubmit =
    password.trim().length > 0 &&
    (!captchaRequired || Boolean(turnstileToken));

  const resetTurnstile = useCallback(() => {
    setTurnstileToken(null);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) return;
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: "dark",
        callback: (token: string) => setTurnstileToken(token),
        "error-callback": () => setTurnstileToken(null),
        "expired-callback": () => setTurnstileToken(null),
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const interval = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(interval);
        renderWidget();
      }
    }, 120);

    return () => window.clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) return;

    setLoading(true);

    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          password,
          turnstileToken: turnstileToken ?? "",
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        bypass?: boolean;
      };

      if (res.ok && data.ok) {
        onUnlock();
        return;
      }

      setError(data.error ?? "Incorrect password");
      resetTurnstile();
    } catch {
      setError("Could not verify password. Try again.");
      resetTurnstile();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-0px)] flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-sheet w-full max-w-md p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="icon-glass h-11 w-11 bg-gradient-to-b from-violet-400/25 to-violet-600/10">
            <Mic2 className="h-5 w-5 text-violet-200" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Private portfolio preview
            </p>
            <h1 className="text-[20px] font-semibold tracking-tight text-white">
              Protected Demo
            </h1>
          </div>
        </div>

        <p className="text-[14px] leading-relaxed text-zinc-400">
          Enter password to access ClipScribe AI
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="demo-password"
              className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-zinc-500"
            >
              Password
            </label>
            <input
              id="demo-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/35 focus:ring-2 focus:ring-violet-500/15"
              placeholder="Enter demo password"
            />
          </div>

          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Verification
            </p>
            {SITE_KEY ? (
              <div
                ref={containerRef}
                className="flex min-h-[65px] items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-black/20"
              />
            ) : (
              <p className="rounded-xl border border-amber-400/20 bg-amber-500/[0.08] px-3 py-2.5 text-[13px] text-amber-100/90">
                CAPTCHA is not configured.
              </p>
            )}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-400/20 bg-red-500/[0.08] px-3 py-2.5 text-[13px] text-red-200"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="btn-primary flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Verifying…" : "Unlock demo"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
