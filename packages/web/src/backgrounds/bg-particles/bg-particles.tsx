"use client";
import { useRef, type ReactNode } from "react";
import { cn, useCanvas } from "@kinetik/core";

interface P { x: number; y: number; vx: number; vy: number; r: number }

/** Drifting particles that link with lines when close and gently flee the cursor — the "network" hero background. */
export function BgParticles({ children, density = 0.00012, color = "148 163 184", link = 110, className }: { children?: ReactNode; density?: number; color?: string; link?: number; className?: string }) {
  const ps = useRef<P[]>([]);
  const ref = useCanvas(({ ctx, width, height, dt, pointer }) => {
    const want = Math.round(width * height * density);
    while (ps.current.length < want) ps.current.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 18, vy: (Math.random() - 0.5) * 18, r: 1 + Math.random() * 1.6 });
    ps.current.length = want;
    ctx.clearRect(0, 0, width, height);
    for (const p of ps.current) {
      if (pointer) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < 120 && d > 0.1) {
          p.vx += (dx / d) * 60 * dt;
          p.vy += (dy / d) * 60 * dt;
        }
      }
      p.vx *= 0.995;
      p.vy *= 0.995;
      p.x = (p.x + p.vx * dt + width) % width;
      p.y = (p.y + p.vy * dt + height) % height;
    }
    for (let i = 0; i < ps.current.length; i++) {
      const a = ps.current[i];
      for (let j = i + 1; j < ps.current.length; j++) {
        const b = ps.current[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = `rgb(${color} / ${(1 - d / link) * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = `rgb(${color} / .8)`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <canvas ref={ref} aria-hidden className="absolute inset-0 -z-10 h-full w-full" />
      {children}
    </div>
  );
}
