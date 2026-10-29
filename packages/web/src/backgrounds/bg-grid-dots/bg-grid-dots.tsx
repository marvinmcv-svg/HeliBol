import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

export interface BgGridDotsProps {
  children?: ReactNode;
  variant?: "dots" | "grid";
  size?: number;
  /** Fade the pattern toward the edges with a radial mask. */
  vignette?: boolean;
  /** Slowly pan the pattern. */
  animate?: boolean;
  className?: string;
}

const css = `
@keyframes k-grid-pan{to{background-position:var(--k-gs) var(--k-gs)}}
.k-grid-pan{animation:k-grid-pan 3s linear infinite}
@media (prefers-reduced-motion:reduce){.k-grid-pan{animation:none}}
[data-reduce-motion] .k-grid-pan{animation:none}`;

export function BgGridDots({ children, variant = "dots", size = 24, vignette = true, animate = false, className }: BgGridDotsProps) {
  const line = "color-mix(in oklab, var(--color-foreground, currentColor) 18%, transparent)";
  const bg =
    variant === "dots"
      ? `radial-gradient(circle at 1px 1px, ${line} 1px, transparent 0)`
      : `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`;
  return (
    <div className={cn("relative isolate", className)}>
      <style href="k-grid" precedence="kinetik">{css}</style>
      <div
        aria-hidden
        className={cn("absolute inset-0 -z-10", animate && "k-grid-pan")}
        style={
          {
            backgroundImage: bg,
            backgroundSize: `${size}px ${size}px`,
            "--k-gs": `${size}px`,
            maskImage: vignette ? "radial-gradient(ellipse at center, #000 30%, transparent 75%)" : undefined,
            WebkitMaskImage: vignette ? "radial-gradient(ellipse at center, #000 30%, transparent 75%)" : undefined,
          } as React.CSSProperties
        }
      />
      {children}
    </div>
  );
}
