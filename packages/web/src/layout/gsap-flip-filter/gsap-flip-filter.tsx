"use client";
import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(Flip, useGSAP);

export interface FlipFilterItem {
  id: string;
  tags: string[];
  node: ReactNode;
}

export interface GsapFlipFilterProps {
  items: FlipFilterItem[];
  filters: string[];
  className?: string;
}

/**
 * Filterable grid with GSAP Flip: record positions, toggle `hidden` on items, then Flip.from
 * moves the survivors to their new cells while onEnter/onLeave scale new and removed items.
 * Works with any CSS grid / flex layout — the DOM decides, Flip animates.
 */
export function GsapFlipFilter({ items, filters, className }: GsapFlipFilterProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("All");
  const reduced = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: root });

  const apply = contextSafe((f: string) => {
    setActive(f);
    const els = gsap.utils.toArray<HTMLElement>("[data-item]", root.current);
    const state = Flip.getState(els);
    els.forEach((el) => {
      const show = f === "All" || el.dataset.tags!.split(",").includes(f);
      el.style.display = show ? "" : "none";
    });
    if (reduced) return;
    Flip.from(state, {
      duration: 0.7,
      ease: "power3.inOut",
      scale: true,
      absolute: true,
      stagger: 0.03,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0, duration: 0.4 }),
    });
  });

  return (
    <div ref={root} className={cn("space-y-4", className)}>
      <div role="toolbar" aria-label="Filter" className="flex flex-wrap gap-2">
        {["All", ...filters].map((f) => (
          <button
            key={f}
            onClick={() => apply(f)}
            aria-pressed={active === f}
            className={cn("rounded-full border px-3 py-1 text-sm transition-colors", active === f ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground")}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.id} data-item data-tags={it.tags.join(",")}>
            {it.node}
          </div>
        ))}
      </div>
    </div>
  );
}
