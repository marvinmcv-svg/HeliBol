"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapProximityGridProps {
  items: ReactNode[];
  /** Influence radius in px. */
  radius?: number;
  /** Scale reached right under the cursor. */
  maxScale?: number;
  columns?: number;
  className?: string;
}

/**
 * Every tile scales (and lifts) by how close it is to the pointer: distance → 0..1 with
 * gsap.utils.mapRange, one overwrite:true tween per tile per move so nothing fights.
 */
export function GsapProximityGrid({ items, radius = 180, maxScale = 1.9, columns = 6, className }: GsapProximityGridProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP({ scope: root });

  const onMove = contextSafe((e: React.PointerEvent) => {
    if (reduced || e.pointerType === "touch") return;
    root.current!.querySelectorAll<HTMLElement>("[data-tile]").forEach((tile) => {
      const r = tile.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const p = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, radius, 1, 0, d));
      gsap.to(tile, { scale: 1 + (maxScale - 1) * p, zIndex: Math.round(p * 10), filter: `brightness(${1 + p * 0.25})`, duration: 0.35, ease: "power2.out", overwrite: true });
    });
  });

  const onLeave = contextSafe(() => {
    gsap.to(root.current!.querySelectorAll("[data-tile]"), { scale: 1, filter: "brightness(1)", duration: 0.6, ease: "elastic.out(1, 0.5)", overwrite: true, stagger: { each: 0.01, from: "center" } });
  });

  return (
    <div ref={root} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("grid gap-3", className)} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {items.map((item, i) => (
        <div key={i} data-tile className="relative grid aspect-square place-items-center rounded-2xl border border-border bg-card shadow-sm will-change-transform">
          {item}
        </div>
      ))}
    </div>
  );
}
