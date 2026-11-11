"use client";
import { useMemo } from "react";
import { cn, useCanvas } from "@kinetik/core";

export interface BgGravityStarsProps {
  count?: number;
  /** Pull strength of the cursor "black hole". */
  gravity?: number;
  color?: string;
  className?: string;
}

type Star = { x: number; y: number; vx: number; vy: number; hx: number; hy: number; r: number; tw: number };

/**
 * A starfield where the cursor is a gravity well: nearby stars curve toward it and orbit, then
 * spring back to their home when it leaves. Stars twinkle at rest.
 */
export function BgGravityStars({ count = 220, gravity = 1, color = "255,255,255", className }: BgGravityStarsProps) {
  const stars = useMemo<Star[]>(() => [], []);
  const size = useMemo(() => ({ w: 0, h: 0 }), []);
  const ref = useCanvas(({ ctx, width, height, time, dt, pointer }) => {
    // (re)seed when the count or the canvas size changes
    if (stars.length !== count || size.w !== width || size.h !== height) {
      size.w = width;
      size.h = height;
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width, y = Math.random() * height;
        stars.push({ x, y, vx: 0, vy: 0, hx: x, hy: y, r: Math.random() * 1.4 + 0.3, tw: Math.random() * 6 });
      }
    }
    ctx.clearRect(0, 0, width, height);
    const step = dt * 60;
    for (const s of stars) {
      if (pointer) {
        const dx = pointer.x - s.x, dy = pointer.y - s.y;
        const d2 = dx * dx + dy * dy + 400;
        const f = (gravity * 900) / d2;
        // pull plus a small tangential component so captured stars swirl instead of collapsing
        s.vx += (dx * f - dy * f * 0.6) * 0.02 * step;
        s.vy += (dy * f + dx * f * 0.6) * 0.02 * step;
      }
      // spring home + damping
      s.vx += (s.hx - s.x) * 0.002 * step;
      s.vy += (s.hy - s.y) * 0.002 * step;
      s.vx *= 0.94;
      s.vy *= 0.94;
      s.x += s.vx * step;
      s.y += s.vy * step;
      const speed = Math.min(1, Math.hypot(s.vx, s.vy) / 4);
      const alpha = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(time * 2 + s.tw)) + speed * 0.3;
      ctx.strokeStyle = ctx.fillStyle = `rgba(${color},${Math.min(1, alpha)})`;
      if (speed > 0.15) {
        // motion streak
        ctx.lineWidth = s.r;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  return <canvas ref={ref} aria-hidden className={cn("absolute inset-0 size-full", className)} />;
}
