"use client";
import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapCurveWipeProps {
  /** Screens to cycle through; each gets a label for its nav button. */
  screens: { label: string; node: ReactNode }[];
  /** Wipe colour (any CSS colour). */
  color?: string;
  className?: string;
}

// SVG paths in a 0..100 box: flat bottom → curved belly → full cover → flat top.
const P = {
  hidden: "M 0 100 V 100 Q 50 100 100 100 V 100 z",
  rising: "M 0 100 V 50 Q 50 0 100 50 V 100 z",
  full: "M 0 100 V 0 Q 50 0 100 0 V 100 z",
  leaving: "M 0 0 V 0 Q 50 0 100 0 V 0 z",
  falling: "M 0 0 V 50 Q 50 100 100 50 V 0 z",
};

/**
 * Page transition with a liquid curved wipe: an SVG path tweens its `d` attribute through a
 * bulging curve to cover the screen, the content swaps underneath, then it peels away with
 * the opposite bend. Pure core GSAP (attr tweens) — no plugin needed.
 */
export function GsapCurveWipe({ screens, color = "var(--foreground)", className }: GsapCurveWipeProps) {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [current, setCurrent] = useState(0);
  const busy = useRef(false);
  const reduced = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: root });

  const go = contextSafe((i: number) => {
    if (i === current || busy.current) return;
    if (reduced) return setCurrent(i);
    busy.current = true;
    gsap
      .timeline({ onComplete: () => void (busy.current = false) })
      .set(path.current, { attr: { d: P.hidden } })
      .to(path.current, { attr: { d: P.rising }, duration: 0.45, ease: "power3.in" })
      .to(path.current, { attr: { d: P.full }, duration: 0.25, ease: "power2.out" })
      .add(() => setCurrent(i))
      .fromTo(root.current!.querySelector("[data-screen]"), { y: 60 }, { y: 0, duration: 0.9, ease: "power3.out" }, "+=0.05")
      .set(path.current, { attr: { d: P.full } }, "<")
      .to(path.current, { attr: { d: P.falling }, duration: 0.3, ease: "power3.in" }, "<")
      .to(path.current, { attr: { d: P.leaving }, duration: 0.45, ease: "power2.out" });
  });

  return (
    <div ref={root} className={cn("relative h-full w-full overflow-hidden", className)}>
      <div data-screen className="h-full w-full">{screens[current].node}</div>
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-20 h-full w-full" style={{ color }}>
        <path ref={path} d={P.hidden} fill="currentColor" />
      </svg>
      <nav className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-1 rounded-full border border-border bg-background/80 p-1 backdrop-blur">
        {screens.map((s, i) => (
          <button key={s.label} onClick={() => go(i)} aria-current={current === i ? "page" : undefined} className={cn("rounded-full px-3 py-1 text-xs transition-colors", current === i ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
            {s.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
