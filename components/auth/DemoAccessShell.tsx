"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DemoPasswordGate } from "./DemoPasswordGate";

type AccessPhase = "checking" | "locked" | "unlocked";

interface DemoAccessContextValue {
  lockDemo: () => void;
}

const DemoAccessContext = createContext<DemoAccessContextValue | null>(null);

export function useDemoAccess() {
  const ctx = useContext(DemoAccessContext);
  if (!ctx) {
    throw new Error("useDemoAccess must be used within DemoAccessShell");
  }
  return ctx;
}

function AccessChecking() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-8 w-8 animate-pulse rounded-full border border-white/10 bg-white/[0.04]" />
    </div>
  );
}

export function DemoAccessShell({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<AccessPhase>("checking");

  const unlock = useCallback(() => {
    setPhase("unlocked");
  }, []);

  const lockDemo = useCallback(() => {
    setPhase("locked");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const res = await fetch("/api/verify-password");
        const data = (await res.json()) as { required?: boolean };
        if (cancelled) return;

        if (data.required === false) {
          setPhase("unlocked");
          return;
        }

        setPhase("locked");
      } catch {
        if (!cancelled) setPhase("locked");
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  if (phase === "checking") {
    return <AccessChecking />;
  }

  if (phase === "locked") {
    return <DemoPasswordGate onUnlock={unlock} />;
  }

  return (
    <DemoAccessContext.Provider value={{ lockDemo }}>
      {children}
    </DemoAccessContext.Provider>
  );
}
