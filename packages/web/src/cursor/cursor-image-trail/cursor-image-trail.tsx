"use client";
import { useRef, type ReactNode } from "react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

/** Moving the cursor across the area drops a trail of images that pop in, drift and fade — the editorial portfolio hover. */
export function CursorImageTrail({ images, children, threshold = 80, className }: { images: string[]; children?: ReactNode; threshold?: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const idx = useRef(0);
  const off = useReducedMotion() || usePrefersTouch();
  const move = (e: React.PointerEvent) => {
    if (off || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (last.current && Math.hypot(x - last.current.x, y - last.current.y) < threshold) return;
    const dx = last.current ? x - last.current.x : 0;
    const dy = last.current ? y - last.current.y : 0;
    last.current = { x, y };
    const img = document.createElement("img");
    img.src = images[idx.current++ % images.length];
    img.alt = "";
    img.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:140px;aspect-ratio:3/4;object-fit:cover;border-radius:14px;pointer-events:none;translate:-50% -50%;box-shadow:0 20px 40px -12px rgb(0 0 0/.45);z-index:1`;
    box.current.appendChild(img);
    img.animate(
      [
        { transform: "scale(.4) rotate(-6deg)", opacity: 0 },
        { transform: "scale(1) rotate(0deg)", opacity: 1, offset: 0.15 },
        { transform: `translate(${dx * 0.6}px, ${dy * 0.6}px) scale(.85)`, opacity: 1, offset: 0.7 },
        { transform: `translate(${dx}px, ${dy + 40}px) scale(.6)`, opacity: 0 },
      ],
      { duration: 1100, easing: "cubic-bezier(.16,1,.3,1)" },
    ).onfinish = () => img.remove();
  };
  return (
    <div ref={box} onPointerMove={move} className={cn("relative isolate overflow-hidden", className)}>
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
