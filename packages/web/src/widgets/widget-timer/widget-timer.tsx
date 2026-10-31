"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@kinetik/core";

/** Countdown ring timer: the ring drains smoothly, the digits roll, and the whole widget pulses when time is up. */
export function WidgetTimer({ seconds = 90, label = "Focus", className }: { seconds?: number; label?: string; className?: string }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running || left <= 0) return;
    const t = setTimeout(() => setLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [running, left]);
  const done = left <= 0;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <motion.div animate={done ? { scale: [1, 1.04, 1] } : { scale: 1 }} transition={{ duration: 0.6, repeat: done ? Infinity : 0 }} className={cn("flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-5", className)}>
      <div className="relative size-40">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeOpacity=".1" strokeWidth="7" />
          <motion.circle cx="50" cy="50" r="44" fill="none" stroke={done ? "#22c55e" : "#f97316"} strokeWidth="7" strokeLinecap="round" pathLength={1} initial={false} animate={{ pathLength: left / seconds }} transition={{ duration: 1, ease: "linear" }} />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center"><p className="text-xs text-muted-foreground">{done ? "Done!" : label}</p><p className="font-mono text-3xl font-semibold tabular-nums" role="timer" aria-live="off">{mm}:{ss}</p></div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setRunning((r) => !r)} disabled={done} aria-label={running ? "Pause" : "Start"} className="grid size-10 place-items-center rounded-full bg-foreground text-background disabled:opacity-40">{running ? <Pause className="size-4" /> : <Play className="size-4" />}</button>
        <button onClick={() => (setLeft(seconds), setRunning(false))} aria-label="Reset" className="grid size-10 place-items-center rounded-full border border-border"><RotateCcw className="size-4" /></button>
      </div>
      <span className="sr-only" aria-live="polite">{done ? `${label} timer finished` : ""}</span>
    </motion.div>
  );
}
