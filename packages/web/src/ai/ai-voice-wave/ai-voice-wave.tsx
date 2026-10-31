"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Mic, MicOff } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Voice input: a mic button that expands into live waveform bars (simulated, or pass `levels` from an AnalyserNode). */
export function AiVoiceWave({ levels: external, bars = 24, className }: { levels?: number[]; bars?: number; className?: string }) {
  const [on, setOn] = useState(false);
  const [levels, setLevels] = useState<number[]>(() => Array(bars).fill(0.1));
  const [secs, setSecs] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!on) return setLevels(Array(bars).fill(0.1));
    const t = setInterval(() => setLevels((l) => l.map((_, i) => (external ? external[i] ?? 0.1 : 0.15 + Math.abs(Math.sin(Date.now() / 220 + i * 0.6)) * Math.random() * 0.85))), 90);
    const c = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => (clearInterval(t), clearInterval(c));
  }, [on, bars, external]);
  return (
    <motion.div layout className={cn("flex h-14 items-center gap-3 rounded-full border border-border bg-card px-2", className)}>
      <motion.button layout whileTap={{ scale: 0.9 }} onClick={() => (setOn((o) => !o), setSecs(0))} aria-pressed={on} aria-label={on ? "Stop recording" : "Start voice input"} className={cn("grid size-10 shrink-0 place-items-center rounded-full", on ? "bg-rose-500 text-white" : "bg-foreground text-background")}>
        {on ? <MicOff className="size-4" /> : <Mic className="size-4" />}
      </motion.button>
      {on && (
        <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} className="flex items-center gap-3 pr-3">
          <div className="flex h-8 items-center gap-[3px]" aria-hidden>
            {levels.map((v, i) => <motion.span key={i} className="w-[3px] rounded-full bg-foreground" animate={{ height: `${Math.max(12, v * 100)}%` }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }} />)}
          </div>
          <span className="font-mono text-xs text-muted-foreground tabular-nums" role="timer">0:{String(secs).padStart(2, "0")}</span>
        </motion.div>
      )}
      {!on && <span className="pr-3 text-sm text-muted-foreground">Tap to speak</span>}
    </motion.div>
  );
}
