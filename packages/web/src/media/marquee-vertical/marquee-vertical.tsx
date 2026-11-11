import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

export interface MarqueeVerticalProps {
  /** One array of items per column. */
  columns: ReactNode[][];
  /** Seconds for one loop of the first column; others vary slightly so they drift apart. */
  duration?: number;
  className?: string;
}

const css = `
@keyframes kn-vmarquee { to { transform: translateY(-50%); } }
.kn-vcol { animation: kn-vmarquee var(--kn-dur) linear infinite; }
.kn-vcol[data-reverse] { animation-direction: reverse; }
.kn-vwrap:hover .kn-vcol, .kn-vwrap:focus-within .kn-vcol { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .kn-vcol { animation: none; } }
[data-reduce-motion] .kn-vcol { animation: none; }
`;

/**
 * Columns of cards scrolling endlessly up and down in alternating directions (pure CSS), masked to
 * fade at the edges. Hover or focus pauses; reduced motion shows a still wall.
 */
export function MarqueeVertical({ columns, duration = 40, className }: MarqueeVerticalProps) {
  return (
    <div className={cn("kn-vwrap relative grid h-full gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]", className)} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
      <style href="kn-marquee-vertical" precedence="kinetik">{css}</style>
      {columns.map((items, c) => (
        <div key={c} className="kn-vcol flex flex-col gap-4" data-reverse={c % 2 ? "" : undefined} style={{ ["--kn-dur" as string]: `${duration * (1 + c * 0.15)}s` }}>
          {items.map((it, i) => <div key={i}>{it}</div>)}
          {/* duplicate for a seamless loop — hidden from assistive tech */}
          {items.map((it, i) => <div key={`d${i}`} aria-hidden>{it}</div>)}
        </div>
      ))}
    </div>
  );
}
