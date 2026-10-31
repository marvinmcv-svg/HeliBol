"use client";
import { useMemo, useState } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

/** A pixel mosaic covers the image and dissolves square by square (random order) on hover/focus. */
export function CardPixelReveal({ image, alt, cols = 12, rows = 8, color = "var(--color-foreground, #111)", className }: { image: string; alt: string; cols?: number; rows?: number; color?: string; className?: string }) {
  const [on, setOn] = useState(false);
  const reduced = useReducedMotion();
  const delays = useMemo(() => Array.from({ length: cols * rows }, (_, i) => ((i * 7919) % 97) / 97), [cols, rows]);
  return (
    <div
      tabIndex={0}
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      className={cn("relative overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <img src={image} alt={alt} className="h-full w-full object-cover" />
      <div aria-hidden className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {delays.map((d, i) => (
          <span key={i} style={{ background: color, opacity: on ? 0 : 1, transition: reduced ? "opacity .2s" : `opacity 0s linear ${d * 0.45}s` }} />
        ))}
      </div>
      <span className={cn("pointer-events-none absolute inset-0 grid place-items-center text-sm font-medium text-background transition-opacity", on && "opacity-0")}>Hover to reveal</span>
    </div>
  );
}
