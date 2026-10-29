"use client";
import { useRef, type ReactNode } from "react";
import { cn } from "@kinetik/core";

export interface SpotlightBorderGridProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

/**
 * Wrap a grid of <SpotlightBorderCard>s: one pointer listener on the grid sets per-card CSS
 * variables so the border glow is continuous across neighbouring cards.
 */
export function SpotlightBorderGrid({ children, color = "rgb(168 85 247)", className }: SpotlightBorderGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    ref.current?.querySelectorAll<HTMLElement>("[data-k-sb]").forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--k-x", `${e.clientX - r.left}px`);
      card.style.setProperty("--k-y", `${e.clientY - r.top}px`);
    });
  };
  return (
    <div ref={ref} onPointerMove={onMove} className={cn("group/sb", className)} style={{ "--k-sb-color": color } as React.CSSProperties}>
      {children}
    </div>
  );
}

export function SpotlightBorderCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-k-sb className={cn("relative rounded-2xl bg-border p-px", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/sb:opacity-100 motion-reduce:hidden"
        style={{ background: "radial-gradient(260px circle at var(--k-x) var(--k-y), var(--k-sb-color), transparent 70%)" }}
      />
      <div className="relative h-full overflow-hidden rounded-[calc(1rem-1px)] bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/sb:opacity-100 motion-reduce:hidden"
          style={{ background: "radial-gradient(360px circle at var(--k-x) var(--k-y), color-mix(in oklab, var(--k-sb-color) 10%, transparent), transparent 70%)" }}
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}
