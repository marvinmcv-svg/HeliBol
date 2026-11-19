"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface MediaSliceSliderProps {
  slides: { image: string; title: string; caption?: string }[];
  /** Number of vertical slices in the transition. */
  slices?: number;
  /** Autoplay interval in ms (0 = off). Pauses on hover/focus. */
  autoplay?: number;
  className?: string;
}

/**
 * Editorial slider whose transition cuts the incoming photo into vertical slices that drop in with a
 * staggered, alternating direction (odd slices from above, even from below) over the outgoing one;
 * the title rises line by line. Arrow keys, buttons and autoplay that pauses on hover.
 */
export function MediaSliceSlider({ slides, slices = 6, autoplay = 4500, className }: MediaSliceSliderProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const busy = useRef(false);

  const go = (d: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;
    setDir(d);
    setPrev(i);
    setI((n) => (n + d + slides.length) % slides.length);
    setTimeout(() => (busy.current = false), reduced ? 0 : 900);
  };
  useEffect(() => {
    if (!autoplay || paused || reduced) return;
    const id = setTimeout(() => go(1), autoplay);
    return () => clearTimeout(id);
  });

  const s = slides[i];
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "ArrowRight" ? go(1) : e.key === "ArrowLeft" ? go(-1) : null)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn("relative h-full overflow-hidden rounded-3xl bg-black text-white outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      {prev !== null && <img src={slides[prev].image} alt="" className="absolute inset-0 size-full object-cover" />}
      <div key={i} className="absolute inset-0 flex">
        {Array.from({ length: slices }, (_, k) => (
          <motion.div
            key={k}
            className="relative h-full flex-1 overflow-hidden"
            initial={reduced || prev === null ? { opacity: prev === null ? 1 : 0 } : { y: (k % 2 ? -1 : 1) * 100 * dir + "%" }}
            animate={{ y: "0%", opacity: 1 }}
            transition={reduced ? { duration: 0.3 } : { duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: (dir > 0 ? k : slices - 1 - k) * 0.05 }}
          >
            <img src={s.image} alt="" className="absolute top-0 h-full max-w-none object-cover" style={{ width: `${slices * 100}%`, left: `${-k * 100}%` }} />
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
        <div aria-live="polite" className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={i} initial="h" animate="s" exit="x" variants={{ s: { transition: { staggerChildren: 0.08, delayChildren: reduced ? 0 : 0.35 } } }}>
              {[s.caption, s.title].filter(Boolean).map((line, n) => (
                <div key={n} className="overflow-hidden">
                  <motion.p
                    variants={{ h: { y: reduced ? 0 : "110%", opacity: reduced ? 0 : 1 }, s: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }, x: { opacity: 0, transition: { duration: 0.2 } } }}
                    className={n === 0 && s.caption ? "text-[10px] uppercase tracking-[0.3em] text-white/70" : "text-3xl font-semibold tracking-tight"}
                  >
                    {line}
                  </motion.p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="mr-2 text-xs tabular-nums text-white/70">{String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => go(-1)} aria-label="Previous" className="grid size-10 place-items-center rounded-full border border-white/30 backdrop-blur hover:bg-white/15"><ArrowLeft className="size-4" /></button>
          <button type="button" onClick={() => go(1)} aria-label="Next" className="grid size-10 place-items-center rounded-full border border-white/30 backdrop-blur hover:bg-white/15"><ArrowRight className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}
