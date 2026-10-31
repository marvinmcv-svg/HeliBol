"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Battery level with a sloshing liquid fill, color by level, and a pulsing bolt while charging. */
export function WidgetBattery({ level, charging = false, label = "iPhone", className }: { level: number; charging?: boolean; label?: string; className?: string }) {
  const reduced = useReducedMotion();
  const pct = Math.max(0, Math.min(100, level));
  const color = pct <= 20 ? "#ef4444" : pct <= 50 ? "#f59e0b" : "#22c55e";
  return (
    <div className={cn("flex items-center gap-4 rounded-3xl border border-border bg-card p-4", className)} role="meter" aria-label={`${label} battery`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="relative h-24 w-12 overflow-hidden rounded-xl border-2 border-foreground/70 p-0.5">
        <span className="absolute -top-1.5 left-1/2 h-1.5 w-5 -translate-x-1/2 rounded-t bg-foreground/70" />
        <motion.div className="absolute inset-x-0.5 bottom-0.5 overflow-hidden rounded-lg" initial={false} animate={{ height: `calc(${pct}% - 4px)` }} transition={{ type: "spring", stiffness: 80, damping: 15 }} style={{ background: color }}>
          <motion.svg viewBox="0 0 120 10" preserveAspectRatio="none" className="absolute -top-1.5 left-0 h-3 w-[200%]" animate={reduced ? {} : { x: ["0%", "-50%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <path d="M0 5 Q15 0 30 5 T60 5 T90 5 T120 5 V10 H0Z" fill={color} />
          </motion.svg>
        </motion.div>
        {charging && <motion.span className="absolute inset-0 grid place-items-center text-xl text-white drop-shadow" animate={reduced ? {} : { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.4, repeat: Infinity }}>⚡</motion.span>}
      </div>
      <div><p className="text-sm text-muted-foreground">{label}</p><p className="text-3xl font-semibold tabular-nums">{Math.round(pct)}%</p><p className="text-xs text-muted-foreground">{charging ? "Charging" : pct <= 20 ? "Low power" : "On battery"}</p></div>
    </div>
  );
}
