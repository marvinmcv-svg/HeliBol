"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapAutoHeightItem {
  title: string;
  content: ReactNode;
}

export interface GsapAutoHeightProps {
  items: GsapAutoHeightItem[];
  /** Allow several panels open at once. */
  multiple?: boolean;
  className?: string;
}

/**
 * Accordion built on one paused GSAP timeline per panel that tweens to height:"auto" (GSAP measures
 * it), fades and lifts the content, and rotates the chevron. Toggling just plays or reverses that
 * timeline, so rapid clicks reverse smoothly mid-flight instead of jumping.
 */
export function GsapAutoHeight({ items, multiple = false, className }: GsapAutoHeightProps) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const tls = useRef<gsap.core.Timeline[]>([]);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const id = useId();

  useGSAP(
    () => {
      tls.current = gsap.utils.toArray<HTMLElement>("[data-panel]").map((panel, i) => {
        const tl = gsap.timeline({ paused: true, defaults: { duration: reduced ? 0 : 0.45, ease: "power3.inOut" } });
        tl.fromTo(panel, { height: 0 }, { height: "auto" })
          .fromTo(panel.firstElementChild, { autoAlpha: 0, y: reduced ? 0 : -8 }, { autoAlpha: 1, y: 0, duration: reduced ? 0 : 0.3, ease: "power2.out" }, reduced ? 0 : 0.15)
          .to(root.current!.querySelectorAll("[data-chevron]")[i], { rotate: 180 }, 0);
        return tl;
      });
    },
    { scope: root, dependencies: [items.length, reduced], revertOnUpdate: true },
  );

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : prev.has(i) ? [i] : []);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      tls.current.forEach((tl, k) => (next.has(k) ? tl.play() : tl.reverse()));
      return next;
    });
  };

  return (
    <div ref={root} className={cn("w-full divide-y divide-border rounded-2xl border border-border", className)}>
      {items.map((it, i) => (
        <div key={it.title}>
          <h3>
            <button
              type="button"
              id={`${id}-h${i}`}
              aria-expanded={open.has(i)}
              aria-controls={`${id}-p${i}`}
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              {it.title}
              <ChevronDown data-chevron className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </h3>
          <div data-panel id={`${id}-p${i}`} role="region" aria-labelledby={`${id}-h${i}`} className="h-0 overflow-hidden" inert={!open.has(i)}>
            <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{it.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
