"use client";
import { cn, useCanvas } from "@kinetik/core";

export interface BgSquarePatternProps {
  /** Cell size in CSS px. */
  cell?: number;
  /** Gap between squares in CSS px. */
  gap?: number;
  /** RGB triplet for lit squares, e.g. "167,139,250". */
  color?: string;
  /** Wave pattern travelling across the grid. */
  pattern?: "diagonal" | "radial" | "rain";
  className?: string;
}

/**
 * A grid of small squares lit by a travelling wave (diagonal sweep, radial pulse or digital rain),
 * plus a soft glow that follows the cursor. Static dim grid under reduced motion.
 */
export function BgSquarePattern({ cell = 18, gap = 3, color = "167,139,250", pattern = "diagonal", className }: BgSquarePatternProps) {
  const ref = useCanvas(({ ctx, width, height, time, pointer }) => {
    ctx.clearRect(0, 0, width, height);
    const cols = Math.ceil(width / cell), rows = Math.ceil(height / cell);
    const cx = cols / 2, cy = rows / 2;
    const size = cell - gap;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        let w = 0;
        if (pattern === "diagonal") w = Math.sin((x + y) * 0.35 - time * 2.4);
        else if (pattern === "radial") w = Math.sin(Math.hypot(x - cx, y - cy) * 0.5 - time * 2.6);
        else {
          // rain: each column has its own falling head
          const head = ((time * (6 + ((x * 7919) % 11)) + x * 13) % (rows + 12)) - 6;
          const d = head - y;
          w = d >= 0 && d < 8 ? 1 - d / 8 : -1;
        }
        let a = 0.06 + Math.max(0, w) ** 3 * 0.55;
        if (pointer) {
          const d = Math.hypot(x * cell + cell / 2 - pointer.x, y * cell + cell / 2 - pointer.y);
          a += Math.max(0, 1 - d / 140) * 0.5;
        }
        ctx.fillStyle = `rgba(${color},${Math.min(0.9, a)})`;
        ctx.fillRect(x * cell + gap / 2, y * cell + gap / 2, size, size);
      }
    }
  });
  return <canvas ref={ref} aria-hidden className={cn("absolute inset-0 size-full", className)} />;
}
