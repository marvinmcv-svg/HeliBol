"use client";
import { useEffect, useRef, useState } from "react";
import { cn, useInView, useReducedMotion } from "@kinetik/core";

export interface SvgSignatureProps {
  /** One or more stroke paths, drawn in order (like separate pen strokes). */
  paths?: string[];
  viewBox?: string;
  /** Average pen speed in viewBox units per second. */
  speed?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

// An original flowing signature ("Kinetik") drawn as three strokes plus an underline flourish.
const DEFAULT_PATHS = [
  "M20 92 C 22 70, 28 40, 34 26 M34 26 C 30 52, 28 72, 30 96 M30 66 C 44 56, 58 44, 62 34 M38 64 C 50 72, 60 86, 72 94",
  "M80 78 C 82 70, 84 66, 86 64 M90 50 L 91 49 M98 92 C 100 76, 104 66, 112 66 C 120 66, 118 82, 120 92 C 124 80, 130 70, 140 70 C 150 70, 146 86, 152 90 C 160 92, 168 84, 172 72 C 176 60, 162 60, 160 72 C 158 84, 172 94, 186 86 C 194 80, 198 66, 200 44 C 201 70, 202 84, 206 92 M192 64 L 214 62",
  "M222 78 C 224 70, 226 66, 228 64 M232 50 L 233 49 M240 30 C 240 56, 240 76, 242 96 M242 76 C 252 66, 262 60, 268 54 M246 74 C 256 80, 266 90, 280 94",
  "M18 112 C 90 102, 190 100, 300 106 C 260 110, 236 114, 220 120",
];

/**
 * A handwritten signature that writes itself: each stroke is drawn with a dash offset at a speed
 * proportional to its length (so long strokes take longer, like a real pen), with tiny pen-lift
 * pauses between strokes and a slight ink-swell at the end. Starts when visible.
 */
export function SvgSignature({ paths = DEFAULT_PATHS, viewBox = "0 0 320 130", speed = 420, strokeWidth = 3.2, label = "Signature", className }: SvgSignatureProps) {
  const reduced = useReducedMotion();
  const svg = useRef<SVGSVGElement>(null);
  const inView = useInView(svg, { amount: 0.5 });
  const [lens, setLens] = useState<number[]>([]);

  useEffect(() => {
    const els = svg.current?.querySelectorAll("path");
    if (els) setLens([...els].map((p) => (typeof p.getTotalLength === "function" ? p.getTotalLength() : 1000)));
  }, [paths]);

  let t = 0;
  const timings = lens.map((l) => {
    const dur = l / speed;
    const start = t;
    t += dur + 0.12; // pen lift
    return { dur, start };
  });

  return (
    <svg ref={svg} viewBox={viewBox} role="img" aria-label={label} className={cn("h-auto w-full overflow-visible text-foreground", className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d, i) => {
        const len = lens[i] ?? 1000;
        const tm = timings[i];
        const go = (inView || reduced) && tm;
        return (
          <path
            key={i}
            d={d}
            strokeDasharray={len}
            strokeDashoffset={go ? 0 : len}
            style={{
              transition: reduced || !tm ? "none" : `stroke-dashoffset ${tm.dur}s cubic-bezier(.45,.05,.55,.95) ${tm.start}s, stroke-width .4s ease ${tm.start + tm.dur}s`,
              strokeWidth: go ? strokeWidth * 1.04 : strokeWidth,
            }}
          />
        );
      })}
    </svg>
  );
}
