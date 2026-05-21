"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassVariant = "default" | "sheet" | "float" | "widget";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  variant?: GlassVariant;
  floating?: boolean;
  noPad?: boolean;
}

const variantClass: Record<GlassVariant, string> = {
  default: "glass-ios",
  sheet: "glass-sheet",
  float: "glass-float",
  widget: "glass-widget",
};

export function GlassCard({
  children,
  className,
  hover = true,
  delay = 0,
  variant = "default",
  floating = false,
  noPad = false,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: floating ? 14 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        variantClass[variant],
        !noPad && "p-5 sm:p-6",
        hover && "glass-card-hover",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
