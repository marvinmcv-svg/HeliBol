"use client";
import { useRef, type ReactNode } from "react";
import { cn } from "@kinetik/core";

export interface SpotlightProps {
  children: ReactNode;
  /** Radius of the light in px. */
  size?: number;
  color?: string;
  className?: string;
}

/** A soft light that follows the pointer across a section. Writes CSS variables — no React re-renders. */
export function Spotlight({ children, size = 420, color = "rgb(168 85 247 / .22)", className }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--k-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--k-y", `${e.clientY - r.top}px`);
    el.style.setProperty("--k-o", "1");
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => ref.current?.style.setProperty("--k-o", "0")}
      className={cn("relative isolate overflow-hidden", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 motion-reduce:hidden"
        style={{ opacity: "var(--k-o, 0)", background: `radial-gradient(${size}px circle at var(--k-x, 50%) var(--k-y, 50%), ${color}, transparent 70%)` }}
      />
      {children}
    </div>
  );
}
