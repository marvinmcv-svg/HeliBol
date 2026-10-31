"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SkipBack, SkipForward } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Now-playing widget: spinning vinyl, equalizer bars, a scrubbing progress bar and a play↔pause icon morph. */
export function WidgetMusic({ title, artist, cover, duration = 214, className }: { title: string; artist: string; cover: string; duration?: number; className?: string }) {
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(48);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((x) => (x + 1) % duration), 1000);
    return () => clearInterval(id);
  }, [playing, duration]);
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div className={cn("w-72 rounded-3xl border border-border bg-card p-4 shadow-xl", className)}>
      <div className="flex items-center gap-3">
        <motion.div className="relative size-16 shrink-0 rounded-full bg-zinc-900 p-1.5 shadow-inner" animate={playing && !reduced ? { rotate: 360 } : {}} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
          <img src={cover} alt="" className="h-full w-full rounded-full object-cover" />
          <span className="absolute inset-0 m-auto size-3 rounded-full bg-zinc-900 ring-2 ring-zinc-700" />
        </motion.div>
        <div className="min-w-0 flex-1"><p className="truncate font-semibold">{title}</p><p className="truncate text-sm text-muted-foreground">{artist}</p></div>
        <div className="flex h-6 items-end gap-0.5" aria-hidden>
          {[0, 1, 2, 3].map((i) => <motion.span key={i} className="w-1 rounded-full bg-emerald-500" animate={playing && !reduced ? { height: ["30%", "100%", "50%", "80%", "30%"] } : { height: "30%" }} transition={{ duration: 0.9 + i * 0.13, repeat: Infinity }} />)}
        </div>
      </div>
      <div className="mt-4">
        <div className="h-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Playback" aria-valuenow={t} aria-valuemax={duration}><motion.div className="h-full rounded-full bg-foreground" animate={{ width: `${(t / duration) * 100}%` }} transition={{ ease: "linear", duration: 1 }} /></div>
        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground tabular-nums"><span>{fmt(t)}</span><span>-{fmt(duration - t)}</span></div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-6">
        <button aria-label="Previous" onClick={() => setT(0)} className="text-muted-foreground hover:text-foreground"><SkipBack className="size-5 fill-current" /></button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} className="grid size-12 place-items-center rounded-full bg-foreground text-background">
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
            <motion.path initial={false} animate={{ d: playing ? "M7 5L10 5L10 19L7 19Z" : "M8 4L14 8L14 16L8 20Z" }} transition={spring.snappy} />
            <motion.path initial={false} animate={{ d: playing ? "M14 5L17 5L17 19L14 19Z" : "M14 8L20 12L20 12L14 16Z" }} transition={spring.snappy} />
          </svg>
        </motion.button>
        <button aria-label="Next" onClick={() => setT(0)} className="text-muted-foreground hover:text-foreground"><SkipForward className="size-5 fill-current" /></button>
      </div>
    </div>
  );
}
