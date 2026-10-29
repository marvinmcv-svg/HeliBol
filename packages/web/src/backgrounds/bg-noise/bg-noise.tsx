import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

export interface BgNoiseProps {
  children?: ReactNode;
  opacity?: number;
  /** Animate the grain like film (steps, not smooth). */
  animated?: boolean;
  className?: string;
}

const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1.2 -0.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const css = `
@keyframes k-grain{0%,100%{transform:translate(0,0)}20%{transform:translate(-5%,3%)}40%{transform:translate(4%,-6%)}60%{transform:translate(-3%,7%)}80%{transform:translate(6%,2%)}}
.k-grain{animation:k-grain .6s steps(1) infinite}
@media (prefers-reduced-motion:reduce){.k-grain{animation:none}}
[data-reduce-motion] .k-grain{animation:none}`;

export function BgNoise({ children, opacity = 0.18, animated = true, className }: BgNoiseProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-grain" precedence="kinetik">{css}</style>
      {children}
      <div aria-hidden className={cn("pointer-events-none absolute -inset-[20%] mix-blend-overlay", animated && "k-grain")} style={{ backgroundImage: noise, opacity }} />
    </div>
  );
}
