"use client";
import type { ReactNode } from "react";
import { cn, useCanvas } from "@kinetik/core";

/** A dot matrix where dots near the cursor swell and glow, plus a slow ambient wave when idle. */
export function BgDotGlow({ children, gap = 22, color = "139 92 246", radius = 160, className }: { children?: ReactNode; gap?: number; color?: string; radius?: number; className?: string }) {
  const ref = useCanvas(({ ctx, width, height, time, pointer }) => {
    ctx.clearRect(0, 0, width, height);
    for (let y = gap / 2; y < height; y += gap) {
      for (let x = gap / 2; x < width; x += gap) {
        const wave = (Math.sin(x * 0.02 + y * 0.015 + time * 1.2) + 1) / 2;
        let t = wave * 0.15;
        if (pointer) t = Math.max(t, 1 - Math.hypot(x - pointer.x, y - pointer.y) / radius);
        const r = 1 + t * 2.6;
        ctx.fillStyle = t > 0.16 ? `rgb(${color} / ${0.25 + t * 0.75})` : `rgb(148 163 184 / ${0.18 + wave * 0.12})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <canvas ref={ref} aria-hidden className="absolute inset-0 -z-10 h-full w-full" />
      {children}
    </div>
  );
}
