"use client";
import { cn, useCanvas } from "@kinetik/core";

export interface BgSilkLinesProps {
  /** Number of strands. */
  lines?: number;
  /** Gradient across strands (6-digit hex). */
  colors?: [string, string];
  /** Strand thickness in px. */
  width?: number;
  className?: string;
}

/**
 * Dozens of thin strands drawn as one flowing ribbon of silk: each line is a sum of slow sine
 * waves offset by its index, so the bundle twists, folds and catches light; the pointer gently
 * bends the fabric toward it. Canvas 2D, paused off-screen.
 */
export function BgSilkLines({ lines = 46, colors = ["#f0abfc", "#60a5fa"], width = 1.1, className }: BgSilkLinesProps) {
  const ref = useCanvas(({ ctx, width: W, height: H, time, pointer }) => {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = width;
    ctx.globalCompositeOperation = "lighter";
    const steps = Math.ceil(W / 8);
    const bend = pointer ? (pointer.y / H - 0.5) * 0.9 : 0;
    const bx = pointer ? pointer.x / W : 0.5;
    for (let i = 0; i < lines; i++) {
      const k = i / (lines - 1);
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, `${colors[0]}00`);
      grad.addColorStop(0.3, `${colors[0]}`);
      grad.addColorStop(0.7, `${colors[1]}`);
      grad.addColorStop(1, `${colors[1]}00`);
      ctx.strokeStyle = grad;
      ctx.globalAlpha = 0.18 + 0.5 * Math.sin(k * Math.PI) ** 2;
      ctx.beginPath();
      for (let s = 0; s <= steps; s++) {
        const x = (s / steps) * W;
        const u = x / W;
        // twist: phase shifts with index so strands cross and fold like fabric
        const twist = Math.sin(u * 3.2 + time * 0.35 + k * 2.4) * (0.5 - k) * H * 0.38;
        const flow = Math.sin(u * 5.5 - time * 0.6 + k * 0.6) * H * 0.06;
        const pull = bend * H * 0.3 * Math.exp(-((u - bx) ** 2) * 10);
        const y = H * 0.5 + twist + flow + pull + Math.sin(u * 1.4 + time * 0.2) * H * 0.12;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  });
  return <canvas ref={ref} aria-hidden className={cn("absolute inset-0 size-full", className)} />;
}
