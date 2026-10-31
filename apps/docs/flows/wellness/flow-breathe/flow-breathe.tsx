"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { haptic } from "../../_shared/phone";

const phases = [["Inhale", 4, 1.0], ["Hold", 7, 1.0], ["Exhale", 8, 0.45]] as const;

export function FlowBreathe({ initialStep = 0 }: { initialStep?: number }) {
  const [running, setRunning] = useState(initialStep > 0);
  const [p, setP] = useState(initialStep === 2 ? 2 : 0);
  const [left, setLeft] = useState<number>(phases[p][1]);
  const [cycles, setCycles] = useState(initialStep === 2 ? 2 : 0);
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => {
      if (left > 1) return setLeft((l) => l - 1);
      const n = (p + 1) % phases.length;
      if (n === 0) setCycles((c) => c + 1);
      haptic(n === 0 ? "success" : "light");
      setP(n);
      setLeft(phases[n][1]);
    }, 1000);
    return () => clearTimeout(t);
  }, [running, left, p]);
  const [label, dur, scale] = phases[p];
  return (
    <div className="flex h-full flex-col items-center bg-gradient-to-b from-teal-900 via-cyan-950 to-slate-950 px-6 pt-16 pb-10 text-white">
      <p className="text-sm text-white/60">4 · 7 · 8 breathing</p>
      <div className="relative my-auto grid size-64 place-items-center">
        {[0, 1, 2].map((r) => <motion.span key={r} className="absolute rounded-full border border-teal-300/30" style={{ width: 256 - r * 30, height: 256 - r * 30 }} animate={{ scale: running ? scale : 0.6, opacity: running ? 0.9 - r * 0.25 : 0.4 }} transition={{ duration: running ? dur : 1, ease: "easeInOut", delay: r * 0.15 }} />)}
        <motion.span className="absolute size-40 rounded-full bg-gradient-to-br from-teal-300 to-cyan-500 shadow-[0_0_80px_rgb(45_212_191/.5)]" animate={{ scale: running ? scale : 0.6 }} transition={{ duration: running ? dur : 1, ease: "easeInOut" }} />
        <div className="relative text-center" aria-live="polite"><p className="text-2xl font-semibold">{running ? label : "Ready"}</p>{running && <p className="font-mono text-4xl tabular-nums">{left}</p>}</div>
      </div>
      <p className="mb-4 text-sm text-white/60">{cycles} cycle{cycles === 1 ? "" : "s"} complete</p>
      <motion.button whileTap={{ scale: 0.95 }} onClick={() => (haptic("medium"), setRunning((r) => !r))} className="h-14 w-full rounded-2xl bg-white/10 font-semibold backdrop-blur">{running ? "Pause" : "Begin"}</motion.button>
    </div>
  );
}
