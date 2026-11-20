"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { Pause, Play, SkipForward } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface WidgetVinylProps {
  cover: string;
  title: string;
  artist: string;
  className?: string;
}

/**
 * Turntable now-playing widget: the record spins up with inertia when you press play and coasts to
 * a stop on pause, the tonearm swings onto the record, grooves catch a moving highlight and an
 * equaliser dances. Skip slides the record out and a new one in.
 */
export function WidgetVinyl({ cover, title, artist, className }: WidgetVinylProps) {
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [track, setTrack] = useState(0);
  const rot = useMotionValue(0);
  const speed = useRef(0);
  const target = useRef(1);

  useEffect(() => {
    target.current = playing && !reduced ? 1 : 0;
  }, [playing, reduced]);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // spin-up / coast-down: ease speed toward target (33⅓ rpm ≈ 200°/s)
      speed.current += (target.current - speed.current) * Math.min(1, dt * (target.current ? 2.2 : 0.9));
      rot.set(rot.get() + speed.current * 200 * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rot]);

  const skip = () => {
    setTrack((t) => t + 1);
    if (!reduced) animate(rot, rot.get() + 120, { duration: 0.6 });
  };

  return (
    <div className={cn("relative w-80 overflow-hidden rounded-3xl bg-zinc-900 p-5 text-white shadow-2xl", className)}>
      <div className="relative mx-auto aspect-square w-52">
        <motion.div key={track} className="absolute inset-0" initial={reduced ? false : { x: -240, rotate: -90, opacity: 0 }} animate={{ x: 0, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
          <motion.div className="size-full rounded-full shadow-[0_20px_40px_rgb(0_0_0/.6)]" style={{ rotate: rot, background: "repeating-radial-gradient(circle, #111 0 1.5px, #1c1c1c 1.5px 3px)" }}>
            <span aria-hidden className="absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,transparent_0deg,rgb(255_255_255/.12)_30deg,transparent_60deg,transparent_180deg,rgb(255_255_255/.08)_210deg,transparent_240deg)]" />
            <img src={cover} alt="" className="absolute left-1/2 top-1/2 size-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover ring-4 ring-zinc-950" />
            <span aria-hidden className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-300" />
          </motion.div>
        </motion.div>
        {/* tonearm */}
        <motion.div aria-hidden className="absolute -right-6 -top-3 h-40 w-3 origin-top" animate={{ rotate: playing ? 24 : 4 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 12 }}>
          <span className="absolute -left-2.5 -top-2.5 size-8 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow" />
          <span className="absolute left-1 top-2 h-36 w-1 rounded-full bg-gradient-to-b from-zinc-300 to-zinc-400" />
          <span className="absolute -left-0.5 bottom-0 h-6 w-4 rounded-sm bg-zinc-200" />
        </motion.div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="min-w-0">
          <p className="truncate font-semibold">{title}</p>
          <p className="truncate text-sm text-white/60">{artist}</p>
        </div>
        <div aria-hidden className="flex h-5 items-end gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <motion.span key={i} className="w-1 rounded-full bg-emerald-400" animate={playing && !reduced ? { height: ["20%", "100%", "45%", "80%", "20%"] } : { height: "20%" }} transition={{ duration: 0.9 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }} />
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} className="grid size-12 place-items-center rounded-full bg-white text-black transition-transform active:scale-90">
          {playing ? <Pause className="size-5 fill-current" /> : <Play className="ml-0.5 size-5 fill-current" />}
        </button>
        <button type="button" onClick={skip} aria-label="Next track" className="grid size-10 place-items-center rounded-full text-white/80 hover:bg-white/10"><SkipForward className="size-5 fill-current" /></button>
      </div>
    </div>
  );
}
