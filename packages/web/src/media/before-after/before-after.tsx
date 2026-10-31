"use client";
import { useRef, useState } from "react";
import { cn } from "@kinetik/core";

/** Before/after comparison: drag the handle (or use arrow keys — it's a slider) to wipe between two images. */
export function BeforeAfter({ before, after, beforeLabel = "Before", afterLabel = "After", className }: { before: string; after: string; beforeLabel?: string; afterLabel?: string; className?: string }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = (x: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
  };
  return (
    <div ref={box} className={cn("relative touch-none overflow-hidden rounded-2xl select-none", className)} onPointerDown={(e) => (e.currentTarget.setPointerCapture(e.pointerId), drag(e.clientX))} onPointerMove={(e) => e.buttons && drag(e.clientX)}>
      <img src={after} alt={afterLabel} className="block w-full object-cover" draggable={false} />
      <img src={before} alt={beforeLabel} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} draggable={false} />
      <span className="absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur">{beforeLabel}</span>
      <span className="absolute top-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur">{afterLabel}</span>
      <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgb(0_0_0/.5)]" style={{ left: `${pos}%` }}>
        <span
          role="slider"
          tabIndex={0}
          aria-label="Comparison position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
          }}
          className="absolute top-1/2 left-1/2 grid size-10 -translate-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-zinc-900 shadow-xl outline-none focus-visible:ring-4 focus-visible:ring-ring"
        >
          ⇆
        </span>
      </div>
    </div>
  );
}
