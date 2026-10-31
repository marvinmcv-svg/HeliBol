"use client";
import { useRef, type ReactNode } from "react";
import { cn, prefersReducedMotion } from "@kinetik/core";

/** Clicking anywhere inside emits a little starburst of sparks from the click point (canvas overlay). */
export function CursorClickSpark({ children, color = "#a78bfa", count = 10, className }: { children?: ReactNode; color?: string; count?: number; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<{ x: number; y: number; a: number; t: number }[]>([]);
  const raf = useRef(0);
  const draw = () => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = devicePixelRatio || 1;
    if (c.width !== c.clientWidth * dpr) {
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    const now = performance.now();
    sparks.current = sparks.current.filter((s) => now - s.t < 450);
    for (const s of sparks.current) {
      const p = (now - s.t) / 450;
      const e = 1 - Math.pow(1 - p, 3);
      const d = e * 34;
      const len = 12 * (1 - e);
      ctx.beginPath();
      ctx.moveTo(s.x + Math.cos(s.a) * d, s.y + Math.sin(s.a) * d);
      ctx.lineTo(s.x + Math.cos(s.a) * (d + len), s.y + Math.sin(s.a) * (d + len));
      ctx.stroke();
    }
    if (sparks.current.length) raf.current = requestAnimationFrame(draw);
  };
  return (
    <div
      className={cn("relative", className)}
      onPointerDown={(e) => {
        if (prefersReducedMotion() || !canvas.current) return;
        const r = canvas.current.getBoundingClientRect();
        const t = performance.now();
        for (let i = 0; i < count; i++) sparks.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, a: (i / count) * Math.PI * 2, t });
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(draw);
      }}
    >
      {children}
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  );
}
