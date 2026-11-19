"use client";
import { useMemo, type ReactNode } from "react";
import { cn, useCanvas } from "@kinetik/core";

export interface CursorSmokeTrailProps {
  children?: ReactNode;
  /** Colours puffs cycle through. */
  colors?: string[];
  className?: string;
}

type Puff = { x: number; y: number; vx: number; vy: number; r: number; life: number; hue: number };

/**
 * A soft, glowing smoke trail: the pointer emits puffs that inherit its velocity, rise, swirl on a
 * curl-ish noise field, expand and fade. Additive blending makes overlapping puffs bloom. Contained
 * to its area; paused off-screen; static under reduced motion.
 */
export function CursorSmokeTrail({ children, colors = ["#a78bfa", "#22d3ee", "#f472b6"], className }: CursorSmokeTrailProps) {
  const puffs = useMemo<Puff[]>(() => [], []);
  const last = useMemo(() => ({ x: 0, y: 0, has: false, i: 0 }), []);
  const ref = useCanvas(({ ctx, width, height, time, dt, pointer }) => {
    if (pointer) {
      const vx = last.has ? pointer.x - last.x : 0, vy = last.has ? pointer.y - last.y : 0;
      const n = Math.min(6, 1 + Math.floor(Math.hypot(vx, vy) / 6));
      for (let k = 0; k < n; k++) {
        puffs.push({ x: pointer.x - (vx * k) / n, y: pointer.y - (vy * k) / n, vx: vx * 0.15 + (Math.random() - 0.5), vy: vy * 0.15 - 0.4, r: 6 + Math.random() * 8, life: 1, hue: last.i++ % colors.length });
      }
      Object.assign(last, { x: pointer.x, y: pointer.y, has: true });
    } else last.has = false;
    if (puffs.length > 420) puffs.splice(0, puffs.length - 420);
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    const step = dt * 60;
    for (let i = puffs.length - 1; i >= 0; i--) {
      const p = puffs[i];
      // swirl field
      const a = Math.sin(p.x * 0.012 + time) + Math.cos(p.y * 0.014 - time * 0.8);
      p.vx += Math.cos(a * 2) * 0.06 * step;
      p.vy += (Math.sin(a * 2) * 0.06 - 0.02) * step;
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.r += 0.45 * step;
      p.life -= 0.012 * step;
      if (p.life <= 0) {
        puffs.splice(i, 1);
        continue;
      }
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `${colors[p.hue]}${Math.round(p.life * 90).toString(16).padStart(2, "0")}`);
      g.addColorStop(1, `${colors[p.hue]}00`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  });
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full" />
      {children}
    </div>
  );
}
