"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export type TermLine = { cmd: string } | { out: string; tone?: "ok" | "muted" | "warn" };

/** Terminal that types its commands character by character and reveals output lines with a little delay. */
export function WidgetTerminal({ lines, title = "zsh — kinetik", className }: { lines: TermLine[]; title?: string; className?: string }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(reduced ? lines.length : 0);
  const [chars, setChars] = useState(0);
  useEffect(() => {
    if (reduced) return setStep(lines.length);
    if (step >= lines.length) return;
    const line = lines[step];
    if ("cmd" in line) {
      if (chars < line.cmd.length) {
        const t = setTimeout(() => setChars((c) => c + 1), 40);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => (setStep((s) => s + 1), setChars(0)), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 220);
    return () => clearTimeout(t);
  }, [step, chars, lines, reduced]);
  const tone = { ok: "text-emerald-400", muted: "text-zinc-500", warn: "text-amber-400" };
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 font-mono text-[13px] text-zinc-200 shadow-2xl", className)}>
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="size-3 rounded-full bg-rose-500" /><span className="size-3 rounded-full bg-amber-400" /><span className="size-3 rounded-full bg-emerald-500" />
        <span className="ml-3 text-xs text-zinc-500">{title}</span>
      </div>
      <div className="space-y-1 p-4" role="log" aria-label="Terminal output">
        {lines.slice(0, step + 1).map((l, i) =>
          "cmd" in l ? (
            <p key={i}><span className="text-violet-400">❯</span> {i === step ? l.cmd.slice(0, chars) : l.cmd}{i === step && <span className="ml-px inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-zinc-300" />}</p>
          ) : i < step || (i === step && reduced) ? (
            <motion.p key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className={l.tone ? tone[l.tone] : undefined}>{l.out}</motion.p>
          ) : null,
        )}
      </div>
    </div>
  );
}
