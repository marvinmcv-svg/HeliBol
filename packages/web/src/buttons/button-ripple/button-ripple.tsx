"use client";
import { useState, type ButtonHTMLAttributes } from "react";
import { cn, prefersReducedMotion } from "@kinetik/core";

interface Ripple { id: number; x: number; y: number; size: number }

const css = `@keyframes k-ripple{from{transform:scale(0);opacity:.45}to{transform:scale(1);opacity:0}}`;

/** Material-style ink ripple that grows from the exact press point. */
export function ButtonRipple({ className, children, onPointerDown, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  return (
    <>
      <style href="k-ripple" precedence="kinetik">{css}</style>
      <button
        {...props}
        onPointerDown={(e) => {
          onPointerDown?.(e);
          if (prefersReducedMotion()) return;
          const r = e.currentTarget.getBoundingClientRect();
          const size = Math.hypot(r.width, r.height) * 2;
          const id = Date.now() + Math.random();
          setRipples((rs) => [...rs, { id, x: e.clientX - r.left - size / 2, y: e.clientY - r.top - size / 2, size }]);
          setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== id)), 650);
        }}
        className={cn("relative inline-flex h-11 items-center justify-center overflow-hidden rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", className)}
      >
        {ripples.map((r) => (
          <span key={r.id} aria-hidden className="pointer-events-none absolute rounded-full bg-current" style={{ left: r.x, top: r.y, width: r.size, height: r.size, animation: "k-ripple .65s cubic-bezier(.2,0,0,1) forwards" }} />
        ))}
        <span className="relative">{children}</span>
      </button>
    </>
  );
}
