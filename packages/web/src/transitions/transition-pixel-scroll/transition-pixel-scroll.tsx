"use client";
import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TransitionPixelScrollProps {
  /** Section shown before the transition. */
  from: ReactNode;
  /** Section revealed by the pixels. */
  to: ReactNode;
  /** Pixel grid columns (rows follow the aspect ratio). */
  columns?: number;
  /** Pixel colour. */
  color?: string;
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Scroll-scrubbed pixel dissolve between two sections: as you scroll through the pinned area a grid of
 * squares fills in random order to cover the first section, then clears in a new random order to
 * reveal the second. Driven by scroll position only (no timers). Reduced motion: a simple crossfade.
 */
export function TransitionPixelScroll({ from, to, columns = 16, color = "#18181b", scroller, className }: TransitionPixelScrollProps) {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const toLayer = useRef<HTMLDivElement>(null);
  const rows = Math.round(columns * 0.62);
  // two random orders: one for covering, one for uncovering
  const orders = useMemo(() => {
    const n = columns * rows;
    const shuffle = () => {
      const a = Array.from({ length: n }, (_, i) => i);
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    const rankIn = new Array(n), rankOut = new Array(n);
    shuffle().forEach((cell, r) => (rankIn[cell] = r / n));
    shuffle().forEach((cell, r) => (rankOut[cell] = r / n));
    return { rankIn, rankOut };
  }, [columns, rows]);

  useEffect(() => {
    const sec = section.current, g = grid.current, tl = toLayer.current;
    if (!sec || !g || !tl) return;
    const sc = scroller?.current ?? null;
    const cells = [...g.children] as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = sc ? sc.clientHeight : window.innerHeight;
      const top = sec.getBoundingClientRect().top - (sc ? sc.getBoundingClientRect().top : 0);
      const p = Math.max(0, Math.min(1, -top / (sec.offsetHeight - vh))); // 0..1 through the section
      if (reduced) {
        tl.style.opacity = String(p > 0.5 ? 1 : 0);
        return;
      }
      const cover = Math.min(1, p / 0.45), uncover = Math.max(0, (p - 0.55) / 0.45);
      tl.style.opacity = p >= 0.5 ? "1" : "0";
      cells.forEach((c, i) => {
        const on = uncover > 0 ? orders.rankOut[i] >= uncover : orders.rankIn[i] < cover;
        c.style.opacity = on ? "1" : "0";
      });
    };
    const target: HTMLElement | Window = sc ?? window;
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => { target.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [orders, reduced, scroller]);

  return (
    <section ref={section} className={cn("relative h-[300cqh]", className)}>
      <div className="sticky top-0 h-[100cqh] overflow-hidden">
        <div className="absolute inset-0">{from}</div>
        <div ref={toLayer} className="absolute inset-0 opacity-0" style={{ transition: reduced ? "opacity .4s" : undefined }}>{to}</div>
        <div ref={grid} aria-hidden className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
          {Array.from({ length: columns * rows }, (_, i) => (
            <span key={i} className="opacity-0" style={{ background: color, marginRight: -1, marginBottom: -1 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
