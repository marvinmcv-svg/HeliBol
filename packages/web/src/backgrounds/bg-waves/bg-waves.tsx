"use client";
import type { ReactNode } from "react";
import { cn, useCanvas } from "@kinetik/core";

/** Layered translucent sine waves that undulate and lean toward the pointer — calm, liquid, endless. */
export function BgWaves({ children, colors = ["#8b5cf6", "#06b6d4", "#ec4899"], className }: { children?: ReactNode; colors?: string[]; className?: string }) {
  const ref = useCanvas(({ ctx, width, height, time, pointer }) => {
    ctx.clearRect(0, 0, width, height);
    const lean = pointer ? (pointer.y / height - 0.5) * 60 : 0;
    colors.forEach((c, i) => {
      ctx.beginPath();
      const base = height * (0.55 + i * 0.1) + lean * (1 - i * 0.3);
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 8) {
        const y = base + Math.sin(x * 0.006 + time * (0.6 + i * 0.25) + i) * (28 + i * 8) + Math.sin(x * 0.017 - time * 0.9) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = c;
      ctx.globalAlpha = 0.28;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  });
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <canvas ref={ref} aria-hidden className="absolute inset-0 -z-10 h-full w-full" />
      {children}
    </div>
  );
}
