"use client";
import { useRef } from "react";
import { cn, useCanvas } from "@kinetik/core";

export type OrbState = "idle" | "listening" | "thinking" | "speaking";

/** A Siri-like voice orb: layered, blurred metaballs that breathe when idle, swell with input level and swirl while thinking. */
export function AiOrb({ state = "idle", level = 0, size = 200, colors = ["#8b5cf6", "#06b6d4", "#ec4899"], className }: { state?: OrbState; level?: number; size?: number; colors?: string[]; className?: string }) {
  const s = useRef({ state, level });
  s.current = { state, level };
  const ref = useCanvas(({ ctx, width, height, time }) => {
    const { state: st, level: lv } = s.current;
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const R = Math.min(width, height) * 0.28;
    const amp = st === "listening" ? 0.15 + lv * 0.35 : st === "speaking" ? 0.18 + Math.abs(Math.sin(time * 6)) * 0.15 : 0.08;
    const spin = st === "thinking" ? 2.2 : 0.6;
    ctx.globalCompositeOperation = "lighter";
    colors.forEach((c, i) => {
      const a = time * spin + (i * Math.PI * 2) / colors.length;
      const off = R * (0.25 + amp * Math.sin(time * 1.7 + i));
      const r = R * (1 + amp * Math.sin(time * 2.3 + i * 1.3));
      const g = ctx.createRadialGradient(cx + Math.cos(a) * off, cy + Math.sin(a) * off, 0, cx + Math.cos(a) * off, cy + Math.sin(a) * off, r);
      g.addColorStop(0, c);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * off, cy + Math.sin(a) * off, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";
  }, { interactive: false });
  return <canvas ref={ref} role="img" aria-label={`Assistant ${state}`} className={cn("blur-[2px]", className)} style={{ width: size, height: size }} />;
}
