"use client";
import { useRef, type ReactNode } from "react";
import { cn, useCanvas } from "@kinetik/core";

export interface BgFlickerGridProps {
  children?: ReactNode;
  square?: number;
  gap?: number;
  color?: string;
  /** chance per second that a square changes */
  flicker?: number;
  maxOpacity?: number;
  className?: string;
}

/** A canvas grid of tiny squares that randomly flicker in brightness — the quiet "data" texture behind heroes. */
export function BgFlickerGrid({ children, square = 4, gap = 6, color = "139 92 246", flicker = 0.3, maxOpacity = 0.35, className }: BgFlickerGridProps) {
  const cells = useRef<Float32Array | null>(null);
  const dims = useRef({ cols: 0, rows: 0 });
  const ref = useCanvas(({ ctx, width, height, dt }) => {
    const step = square + gap;
    const cols = Math.ceil(width / step);
    const rows = Math.ceil(height / step);
    if (!cells.current || dims.current.cols !== cols || dims.current.rows !== rows) {
      dims.current = { cols, rows };
      cells.current = Float32Array.from({ length: cols * rows }, () => Math.random() * maxOpacity);
    }
    const c = cells.current;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < c.length; i++) {
      if (Math.random() < flicker * dt) c[i] = Math.random() * maxOpacity;
      ctx.fillStyle = `rgb(${color} / ${c[i]})`;
      ctx.fillRect((i % cols) * step, Math.floor(i / cols) * step, square, square);
    }
  }, { interactive: false });
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <canvas ref={ref} aria-hidden className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_80%)]" />
      {children}
    </div>
  );
}
