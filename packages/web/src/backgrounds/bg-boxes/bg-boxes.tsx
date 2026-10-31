"use client";
import { useMemo, type ReactNode } from "react";
import { cn } from "@kinetik/core";

const palette = ["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#facc15", "#fb923c"];

/** A skewed isometric grid of cells that light up in random colors as the cursor passes and fade back slowly. */
export function BgBoxes({ children, rows = 18, cols = 22, className }: { children?: ReactNode; rows?: number; cols?: number; className?: string }) {
  const colors = useMemo(() => Array.from({ length: rows * cols }, (_, i) => palette[(i * 7) % palette.length]), [rows, cols]);
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div
        className="absolute -top-1/4 left-1/4 -z-10 grid origin-top-left [transform:translate(-40%,-10%)_skewX(-48deg)_skewY(14deg)_scale(.7)] motion-reduce:pointer-events-none"
        style={{ gridTemplateColumns: `repeat(${cols}, 4rem)` }}
      >
        {colors.map((c, i) => (
          <div
            key={i}
            className="h-8 w-16 border-r border-b border-border transition-colors duration-[1.6s] hover:duration-0"
            onPointerEnter={(e) => (e.currentTarget.style.background = c)}
            onPointerLeave={(e) => (e.currentTarget.style.background = "transparent")}
          />
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5] [background:radial-gradient(ellipse_at_center,transparent_20%,var(--color-background,#000)_75%)]" />
      <div className="pointer-events-none relative">{children}</div>
    </div>
  );
}
