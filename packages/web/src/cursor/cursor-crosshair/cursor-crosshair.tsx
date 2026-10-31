"use client";
import { useRef, useState, type ReactNode } from "react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

/** Full-bleed crosshair lines track the pointer with a live coordinate readout — for design tools and technical brands. */
export function CursorCrosshair({ children, className }: { children?: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [p, setP] = useState<{ x: number; y: number } | null>(null);
  const off = useReducedMotion() || usePrefersTouch();
  return (
    <div
      ref={box}
      onPointerMove={(e) => {
        if (off || !box.current) return;
        const r = box.current.getBoundingClientRect();
        setP({ x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) });
      }}
      onPointerLeave={() => setP(null)}
      className={cn("relative overflow-hidden", !off && "cursor-crosshair", className)}
    >
      {children}
      {p && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 h-px bg-rose-500/70" style={{ top: p.y }} />
          <div className="absolute inset-y-0 w-px bg-rose-500/70" style={{ left: p.x }} />
          <span className="absolute rounded bg-rose-500 px-1.5 py-0.5 font-mono text-[10px] text-white" style={{ left: p.x + 8, top: p.y + 8 }}>
            {p.x}, {p.y}
          </span>
        </div>
      )}
    </div>
  );
}
