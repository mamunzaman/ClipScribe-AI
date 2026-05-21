"use client";

export function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#07070a]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(124, 58, 237, 0.10), transparent 60%), radial-gradient(ellipse 50% 35% at 85% 15%, rgba(56, 189, 248, 0.045), transparent 60%), radial-gradient(ellipse 70% 45% at 15% 110%, rgba(139, 92, 246, 0.06), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)",
        }}
      />
      <div className="absolute inset-0 noise opacity-[0.45] mix-blend-overlay" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 30%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 50% at 50% 30%, black 30%, transparent 80%)",
        }}
      />
    </div>
  );
}
