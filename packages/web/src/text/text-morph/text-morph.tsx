"use client";
import { useEffect, useId, useRef } from "react";
import { cn, prefersReducedMotion } from "@kinetik/core";

export interface TextMorphProps {
  words: string[];
  /** seconds to morph between words */
  morphTime?: number;
  /** seconds to hold each word */
  holdTime?: number;
  className?: string;
}

/** Words melt into each other: two layers cross-blur and a threshold SVG filter fuses the edges. */
export function TextMorph({ words, morphTime = 1, holdTime = 1.6, className }: TextMorphProps) {
  const a = useRef<HTMLSpanElement>(null);
  const b = useRef<HTMLSpanElement>(null);
  const filterId = `k-morph-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  useEffect(() => {
    let i = 0;
    let morph = 0;
    let hold = holdTime;
    let last = performance.now();
    let raf = 0;
    const set = (frac: number) => {
      if (!a.current || !b.current) return;
      const f = Math.max(frac, 1e-4);
      b.current.style.filter = `blur(${Math.min(8 / f - 8, 100)}px)`;
      b.current.style.opacity = `${Math.pow(f, 0.4) * 100}%`;
      const r = 1 - f;
      a.current.style.filter = `blur(${Math.min(8 / Math.max(r, 1e-4) - 8, 100)}px)`;
      a.current.style.opacity = `${Math.pow(r, 0.4) * 100}%`;
    };
    const text = () => {
      if (!a.current || !b.current) return;
      a.current.textContent = words[i % words.length];
      b.current.textContent = words[(i + 1) % words.length];
    };
    text();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (prefersReducedMotion()) {
        hold -= dt;
        if (hold <= 0) {
          i++;
          text();
          hold = holdTime;
        }
        set(0);
      } else if (hold > 0) {
        hold -= dt;
        morph = 0;
        set(0);
      } else {
        morph += dt;
        const frac = morph / morphTime;
        if (frac >= 1) {
          i++;
          text();
          hold = holdTime;
          set(0);
        } else set(frac);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [words, morphTime, holdTime]);

  return (
    <span className={cn("relative inline-grid place-items-center", className)} aria-label={words.join(", ")}>
      <svg className="absolute h-0 w-0" aria-hidden>
        <filter id={filterId}>
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140" />
        </filter>
      </svg>
      <span aria-hidden className="grid place-items-center [grid-template-areas:'s']" style={{ filter: `url(#${filterId})` }}>
        <span ref={a} className="[grid-area:s] whitespace-nowrap" />
        <span ref={b} className="[grid-area:s] whitespace-nowrap opacity-0" />
      </span>
    </span>
  );
}
