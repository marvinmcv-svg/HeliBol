"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ChartBarRaceProps {
  /** Frame labels (e.g. years). */
  frames: string[];
  /** One series per entity: values per frame. */
  series: { name: string; color: string; values: number[] }[];
  /** Bars shown at once. */
  top?: number;
  /** ms per frame. */
  speed?: number;
  title?: string;
  className?: string;
}

/**
 * Bar chart race: each frame re-sorts the entities and the bars glide to their new rank (shared
 * layout), widths and values tween, the big period label rolls, and newcomers slide in from below
 * the cutoff. Play/pause and a scrubber; reduced motion steps without gliding.
 */
export function ChartBarRace({ frames, series, top = 6, speed = 1400, title = "Ranking", className }: ChartBarRaceProps) {
  const reduced = useReducedMotion();
  const [f, setF] = useState(0);
  const [playing, setPlaying] = useState(!reduced);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setF((n) => (n + 1) % frames.length), speed);
    return () => clearTimeout(id);
  }, [f, playing, speed, frames.length]);

  const rows = useMemo(() => series.map((s) => ({ ...s, v: s.values[f] ?? 0 })).sort((a, b) => b.v - a.v).slice(0, top), [series, f, top]);
  const max = rows[0]?.v || 1;
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 140, damping: 22 };

  return (
    <div className={cn("w-full rounded-3xl border border-border bg-card p-5", className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium">{title}</p>
        <div className="relative h-10 overflow-hidden text-right" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p key={f} initial={reduced ? false : { y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? undefined : { y: -30, opacity: 0 }} className="text-3xl font-bold tabular-nums tracking-tight text-muted-foreground">{frames[f]}</motion.p>
          </AnimatePresence>
        </div>
      </div>
      <LayoutGroup>
        <ol className="mt-3 space-y-1.5" aria-label={`${title}, ${frames[f]}`}>
          <AnimatePresence initial={false}>
            {rows.map((r, i) => (
              <motion.li key={r.name} layout={!reduced} transition={t} initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-right tabular-nums text-muted-foreground">{i + 1}</span>
                <div className="relative h-7 flex-1">
                  <motion.div className="flex h-full items-center rounded-lg px-2 font-medium text-white" style={{ background: r.color }} animate={{ width: `${Math.max(8, (r.v / max) * 100)}%` }} transition={t}>
                    <span className="truncate">{r.name}</span>
                  </motion.div>
                </div>
                <span className="w-12 text-right font-semibold tabular-nums">{Math.round(r.v).toLocaleString()}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </LayoutGroup>
      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} className="grid size-8 place-items-center rounded-full bg-foreground text-background">
          {playing ? <Pause className="size-3.5 fill-current" /> : <Play className="ml-0.5 size-3.5 fill-current" />}
        </button>
        <input type="range" min={0} max={frames.length - 1} value={f} onChange={(e) => (setPlaying(false), setF(Number(e.target.value)))} aria-label="Period" className="flex-1" />
      </div>
    </div>
  );
}
