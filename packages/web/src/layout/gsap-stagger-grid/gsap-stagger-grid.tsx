"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapStaggerGridProps {
  rows?: number;
  cols?: number;
  /** Plays a wave on mount from this cell index ("center" for the middle). */
  autoplayFrom?: number | "center" | "random";
  className?: string;
}

/**
 * GSAP's grid stagger made tactile: click any cell and a shock-wave ripples outward from it
 * (`stagger: { grid, from: index, amount }`), each dot squashing, lifting and recolouring by
 * its distance. Keyboard: every cell is a button.
 */
export function GsapStaggerGrid({ rows = 9, cols = 15, autoplayFrom = "center", className }: GsapStaggerGridProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP(
    () => {
      if (!reduced) wave(autoplayFrom === "center" ? Math.floor((rows * cols) / 2) : autoplayFrom === "random" ? Math.floor(Math.random() * rows * cols) : autoplayFrom);
    },
    { scope: root },
  );

  const wave = contextSafe((from: number) => {
    const dots = root.current!.querySelectorAll("[data-dot]");
    if (reduced) {
      gsap.fromTo(dots, { opacity: 0.4 }, { opacity: 1, duration: 0.3 });
      return;
    }
    const rest = getComputedStyle(dots[0]).backgroundColor;
    gsap
      .timeline()
      .to(dots, {
        keyframes: { y: [0, -18, 0], scale: [1, 1.6, 1], ease: "sine.inOut" },
        backgroundColor: (i: number) => `hsl(${250 + (i % cols) * 6} 90% 65%)`,
        duration: 0.7,
        stagger: { grid: [rows, cols], from, amount: 1 },
      })
      .to(dots, { backgroundColor: rest, duration: 0.8, stagger: { grid: [rows, cols], from, amount: 1 } }, 0.5);
  });

  return (
    <div ref={root} className={cn("grid gap-2", className)} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: rows * cols }, (_, i) => (
        <button key={i} onClick={() => wave(i)} aria-label={`Ripple from cell ${i + 1}`} className="grid aspect-square place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
          <span data-dot className="block size-3 rounded-full bg-muted-foreground" />
        </button>
      ))}
    </div>
  );
}
