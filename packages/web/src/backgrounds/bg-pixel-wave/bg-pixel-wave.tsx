"use client";
import { useRef, type ReactNode } from "react";
import { cn, useCanvas } from "@kinetik/core";

export interface BgPixelWaveProps {
  children?: ReactNode;
  /** Cell size in px. */
  cell?: number;
  /** Two colours the wave blends between. */
  colors?: [string, string];
  className?: string;
}

type Ripple = { x: number; y: number; t: number };

/**
 * A grid of square pixels driven by interfering sine waves; each cell's size and colour follow the
 * wave height. Clicks (and an occasional automatic drop) send out expanding rings that swell the
 * pixels they pass, and the pointer leaves a soft bulge. Reduced motion renders one still frame.
 */
export function BgPixelWave({ children, cell = 14, colors = ["#6366f1", "#22d3ee"], className }: BgPixelWaveProps) {
  const ripples = useRef<Ripple[]>([]);
  const nextAuto = useRef(0.6);
  const [a, b] = [hex(colors[0]), hex(colors[1])];
  const ref = useCanvas(({ ctx, width, height, time, pointer }) => {
    ctx.clearRect(0, 0, width, height);
    if (time > nextAuto.current) {
      ripples.current.push({ x: Math.random() * width, y: Math.random() * height, t: time });
      nextAuto.current = time + 2.4;
    }
    for (const r of ripples.current) if (r.t < 0) r.t = time; // clicks are stamped on the next frame
    ripples.current = ripples.current.filter((r) => time - r.t < 3);
    const cols = Math.ceil(width / cell), rows = Math.ceil(height / cell);
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        const x = i * cell + cell / 2, y = j * cell + cell / 2;
        let v = Math.sin(i * 0.28 + time * 1.3) * 0.5 + Math.sin(j * 0.22 - time * 0.9 + i * 0.08) * 0.5; // -1..1
        for (const r of ripples.current) {
          const age = time - r.t, d = Math.hypot(x - r.x, y - r.y), front = age * 260;
          v += Math.exp(-((d - front) ** 2) / 1800) * 1.6 * (1 - age / 3);
        }
        if (pointer) v += Math.exp(-((x - pointer.x) ** 2 + (y - pointer.y) ** 2) / 5000) * 1.2;
        const k = Math.max(0, Math.min(1, (v + 1) / 2.6));
        const s = cell * (0.12 + 0.72 * k);
        ctx.fillStyle = `rgba(${mix(a[0], b[0], k)},${mix(a[1], b[1], k)},${mix(a[2], b[2], k)},${0.18 + 0.82 * k})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
  });
  const host = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={host}
      className={cn("relative overflow-hidden bg-[#06060c]", className)}
      onPointerDown={(e) => {
        const r = host.current!.getBoundingClientRect();
        ripples.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: -1 });
      }}
    >
      <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}

const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255] as const; };
const mix = (x: number, y: number, k: number) => Math.round(x + (y - x) * k);
