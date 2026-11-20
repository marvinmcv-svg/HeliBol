"use client";
import { useId, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TransitionInkBlotProps {
  pages: { title: string; content: ReactNode }[];
  ink?: string;
  className?: string;
}

/**
 * Page transition where ink spills from the exact point you clicked: an SVG circle with a turbulent
 * displacement filter grows into a wobbly blot that floods the screen, the page swaps underneath,
 * then the blot drains away toward the opposite corner. Reduced motion swaps instantly.
 */
export function TransitionInkBlot({ pages, ink = "#0a0a0a", className }: TransitionInkBlotProps) {
  const id = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const r = useMotionValue(0);
  const turb = useRef<SVGFETurbulenceElement>(null);

  const go = async (n: number, e: MouseEvent) => {
    if (n === i || busy) return;
    if (reduced) return setI(n);
    const b = box.current!.getBoundingClientRect();
    const x = e.clientX - b.left, y = e.clientY - b.top;
    const far = Math.hypot(Math.max(x, b.width - x), Math.max(y, b.height - y)) * 1.25;
    setOrigin({ x, y });
    setBusy(true);
    turb.current?.setAttribute("seed", String(Math.round(Math.random() * 100)));
    await animate(r, far, { duration: 0.7, ease: [0.65, 0, 0.35, 1] });
    setI(n);
    setOrigin({ x: b.width - x, y: b.height - y });
    await animate(r, 0, { duration: 0.65, ease: [0.65, 0, 0.35, 1], delay: 0.08 });
    setBusy(false);
  };

  return (
    <div ref={box} className={cn("relative h-full overflow-hidden", className)}>
      <nav className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 gap-1 rounded-full border border-border bg-background/80 p-1 backdrop-blur">
        {pages.map((p, n) => (
          <button key={p.title} type="button" onClick={(e) => go(n, e)} aria-current={i === n ? "page" : undefined} className={cn("rounded-full px-3 py-1 text-xs", i === n ? "bg-foreground text-background" : "text-muted-foreground")}>{p.title}</button>
        ))}
      </nav>
      <div className="h-full">{pages[i]!.content}</div>
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full" style={{ visibility: busy ? "visible" : "hidden" }}>
        <defs>
          <filter id={`ink-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="90" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <motion.circle cx={origin.x} cy={origin.y} r={r} fill={ink} filter={`url(#ink-${id})`} />
      </svg>
    </div>
  );
}
