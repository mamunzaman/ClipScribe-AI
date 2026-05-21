import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "shadow-glass",
    "shadow-glass-lg",
    "shadow-float",
    "shadow-inner-glow",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#030306",
          elevated: "#0c0c12",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        ios: "28px",
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.35)",
        "glass-lg":
          "0 12px 40px -8px rgba(0,0,0,0.5), 0 4px 16px -4px rgba(139,92,246,0.15), inset 0 1px 0 0 rgba(255,255,255,0.08)",
        float:
          "0 20px 50px -12px rgba(0,0,0,0.55), 0 8px 24px -8px rgba(139,92,246,0.2), inset 0 1px 0 0 rgba(255,255,255,0.1)",
        "inner-glow": "inset 0 1px 0 0 rgba(255,255,255,0.12)",
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(at 40% 20%, rgba(139,92,246,0.22) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(34,211,238,0.12) 0px, transparent 45%), radial-gradient(at 0% 50%, rgba(244,114,182,0.1) 0px, transparent 50%)",
      },
      animation: {
        "blob-float": "blob-float 8s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "border-spin": "border-spin 4s linear infinite",
      },
      keyframes: {
        "blob-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(12px, -16px) scale(1.05)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "border-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
