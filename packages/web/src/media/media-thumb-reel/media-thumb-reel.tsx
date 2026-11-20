"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ReelItem { src: string; title: string; meta?: string; alt?: string }
export interface MediaThumbReelProps {
  items: ReelItem[];
  /** Seconds per slide when autoplaying. */
  interval?: number;
  className?: string;
}

/**
 * Hero image with a filmstrip of thumbnails. The active thumb widens into a pill with a progress bar
 * that fills while the hero slowly zooms (Ken Burns); when it fills, the next slide cross-fades in.
 * Hover pauses; clicking a thumb jumps. Reduced motion: no zoom, no autoplay.
 */
export function MediaThumbReel({ items, interval = 5, className }: MediaThumbReelProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = !reduced && !paused;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setI((x) => (x + 1) % items.length), interval * 1000);
    return () => clearTimeout(t);
  }, [i, playing, interval, items.length]);
  const it = items[i]!;

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-black text-white", className)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="relative aspect-[16/10]">
        <AnimatePresence initial={false}>
          <motion.img
            key={i}
            src={it.src}
            alt={it.alt ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.08 }}
            animate={{ opacity: 1, scale: reduced ? 1 : 1.0, transition: { opacity: { duration: 0.8 }, scale: { duration: interval + 1, ease: "linear" } } }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute bottom-24 left-6 right-6" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              {it.meta && <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">{it.meta}</p>}
              <h3 className="text-3xl font-semibold tracking-tight">{it.title}</h3>
            </motion.div>
          </AnimatePresence>
        </div>
        <div role="tablist" aria-label="Slides" className="absolute inset-x-6 bottom-5 flex h-14 gap-2">
          {items.map((t, n) => {
            const on = n === i;
            return (
              <motion.button
                key={t.src + n}
                role="tab"
                type="button"
                aria-selected={on}
                aria-label={t.title}
                onClick={() => setI(n)}
                className="relative h-full overflow-hidden rounded-xl ring-1 ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                animate={{ flexGrow: on ? 4 : 1, opacity: on ? 1 : 0.6 }}
                style={{ flexBasis: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              >
                <img src={t.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                {on && (
                  <span className="absolute inset-x-2 bottom-1.5 h-1 overflow-hidden rounded-full bg-white/30">
                    <motion.span
                      key={`${i}-${playing}`}
                      className="block h-full origin-left bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: playing ? 1 : 0 }}
                      transition={{ duration: playing ? interval : 0, ease: "linear" }}
                    />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
