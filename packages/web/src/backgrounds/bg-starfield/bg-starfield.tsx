"use client";
import { useRef, type ReactNode } from "react";
import { cn, useCanvas } from "@kinetik/core";

interface Star { x: number; y: number; z: number; pz: number }

/** Warp-speed starfield: stars stream out from the center with motion trails. Speed is a prop (hover a button to boost). */
export function BgStarfield({ children, count = 500, speed = 0.6, className }: { children?: ReactNode; count?: number; speed?: number; className?: string }) {
  const stars = useRef<Star[]>([]);
  const ref = useCanvas(({ ctx, width, height, dt }) => {
    if (!stars.current.length) stars.current = Array.from({ length: count }, () => ({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: Math.random(), pz: 0 }));
    ctx.fillStyle = "rgb(2 2 10 / .35)";
    ctx.fillRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.max(width, height) * 0.5;
    for (const s of stars.current) {
      s.pz = s.z;
      s.z -= speed * dt;
      if (s.z <= 0.01) {
        s.x = (Math.random() - 0.5) * 2;
        s.y = (Math.random() - 0.5) * 2;
        s.z = 1;
        s.pz = 1;
      }
      const sx = cx + (s.x / s.z) * scale;
      const sy = cy + (s.y / s.z) * scale;
      const px = cx + (s.x / s.pz) * scale;
      const py = cy + (s.y / s.pz) * scale;
      ctx.strokeStyle = `rgb(255 255 255 / ${Math.min(1, 1.2 - s.z)})`;
      ctx.lineWidth = Math.max(0.5, (1 - s.z) * 2.2);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }
  }, { interactive: false });
  return (
    <div className={cn("relative isolate overflow-hidden bg-[#02020a]", className)}>
      <canvas ref={ref} aria-hidden className="absolute inset-0 -z-10 h-full w-full" />
      {children}
    </div>
  );
}
