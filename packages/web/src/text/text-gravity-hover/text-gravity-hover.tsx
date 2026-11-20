"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextGravityHoverProps {
  text: string;
  /** How far letters fall, in em. */
  drop?: number;
  /** ms before fallen letters float back. */
  restore?: number;
  className?: string;
}

/**
 * Letters that come unstuck: brush a letter and it drops off the line, tumbles and bounces on an
 * invisible floor with a little spin, then after a moment floats back into place on a spring.
 * A "Shake" button drops them all for keyboard users. Reduced motion leaves the text still.
 */
export function TextGravityHover({ text, drop = 1.6, restore = 1800, className }: TextGravityHoverProps) {
  const reduced = useReducedMotion();
  const [shake, setShake] = useState(0);
  return (
    <span className={cn("relative inline-flex flex-col items-center gap-4", className)}>
      <span aria-label={text} className="inline-block whitespace-nowrap">
        {[...text].map((ch, i) => (ch === " " ? <span key={i}>&nbsp;</span> : <Letter key={i} ch={ch} drop={drop} restore={restore} off={reduced} shake={shake} delay={i * 0.03} />))}
      </span>
      {!reduced && (
        <button type="button" onClick={() => setShake((s) => s + 1)} className="rounded-full border px-3 py-1 text-xs font-normal tracking-normal text-muted-foreground hover:text-foreground">
          Shake
        </button>
      )}
    </span>
  );
}

function Letter({ ch, drop, restore, off, shake, delay }: { ch: string; drop: number; restore: number; off: boolean; shake: number; delay: number }) {
  const y = useMotionValue(0), r = useMotionValue(0);
  const busy = useRef(false);
  const el = useRef<HTMLSpanElement>(null);
  const fall = async (d = 0) => {
    if (off || busy.current) return;
    busy.current = true;
    const spin = (Math.random() - 0.5) * 70;
    const em = el.current ? parseFloat(getComputedStyle(el.current).fontSize) : 16;
    const floor = drop * em;
    animate(r, spin, { duration: 0.9, delay: d, ease: "easeOut" });
    await animate(y, [0, floor, floor * 0.72, floor, floor * 0.92, floor], { duration: 1, delay: d, times: [0, 0.4, 0.58, 0.74, 0.86, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn"] });
    await new Promise((res) => setTimeout(res, restore));
    animate(r, 0, { type: "spring", stiffness: 120, damping: 12 });
    await animate(y, 0, { type: "spring", stiffness: 120, damping: 14 });
    busy.current = false;
  };
  useEffect(() => {
    if (shake) fall(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shake]);
  return (
    <motion.span ref={el} aria-hidden className="inline-block will-change-transform" style={{ y, rotate: r }} onPointerEnter={() => fall()}>
      {ch}
    </motion.span>
  );
}
