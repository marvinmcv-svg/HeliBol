"use client";
import { useEffect, useRef } from "react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

/** A pair of googly eyes whose pupils follow the cursor anywhere on the page, and blink occasionally. */
export function CursorEyes({ size = 64, className }: { size?: number; className?: string }) {
  const refs = [useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null)];
  const lids = useRef<HTMLDivElement>(null);
  const off = useReducedMotion() || usePrefersTouch();
  useEffect(() => {
    if (off) return;
    const move = (e: PointerEvent) => {
      for (const r of refs) {
        const p = r.current;
        const eye = p?.parentElement;
        if (!p || !eye) continue;
        const b = eye.getBoundingClientRect();
        const a = Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2));
        const d = Math.min(size * 0.22, Math.hypot(e.clientX - b.left, e.clientY - b.top) / 10);
        p.style.translate = `${Math.cos(a) * d}px ${Math.sin(a) * d}px`;
      }
    };
    const blink = setInterval(() => lids.current?.animate([{ scale: "1 0" }, { scale: "1 1" }, { scale: "1 0" }], { duration: 180 }), 3800);
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      clearInterval(blink);
    };
  }, [off, size]);
  return (
    <div className={cn("relative flex gap-2", className)} aria-hidden>
      {refs.map((r, i) => (
        <div key={i} className="relative grid place-items-center overflow-hidden rounded-full border-4 border-foreground bg-white" style={{ width: size, height: size }}>
          <span ref={r} className="block rounded-full bg-zinc-900 transition-[translate] duration-75" style={{ width: size * 0.38, height: size * 0.38 }}>
            <span className="absolute mt-[18%] ml-[22%] size-1/4 rounded-full bg-white" />
          </span>
        </div>
      ))}
      <div ref={lids} className="pointer-events-none absolute inset-0 origin-top bg-transparent" style={{ scale: "1 0", background: "var(--color-foreground)", borderRadius: size }} />
    </div>
  );
}
