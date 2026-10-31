import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

const css = `
.k-mpath{offset-path:var(--k-path);offset-rotate:auto;animation:k-mpath var(--k-mp-d) cubic-bezier(.45,0,.55,1) infinite;animation-delay:var(--k-mp-delay)}
@keyframes k-mpath{from{offset-distance:0%}to{offset-distance:100%}}
@media (prefers-reduced-motion:reduce){.k-mpath{animation:none;offset-distance:50%}}
[data-reduce-motion] .k-mpath{animation:none;offset-distance:50%}`;

/** Objects travel along an SVG path with CSS motion paths (offset-path), auto-rotating to the path's tangent. No JS. */
export function SvgMotionPath({ path, viewBox = "0 0 400 200", items, duration = 6, className }: { path: string; viewBox?: string; items: ReactNode[]; duration?: number; className?: string }) {
  const [, , w, h] = viewBox.split(" ").map(Number);
  return (
    <div className={cn("relative", className)} style={{ aspectRatio: `${w}/${h}` }}>
      <style href="k-mpath" precedence="kinetik">{css}</style>
      <svg viewBox={viewBox} className="absolute inset-0 h-full w-full" aria-hidden><path d={path} fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="2" strokeDasharray="6 8" /></svg>
      <div className="absolute inset-0" style={{ transform: `scale(var(--k-s, 1))` }}>
        {items.map((it, i) => (
          <span key={i} aria-hidden className="k-mpath absolute top-0 left-0" style={{ "--k-path": `path("${path}")`, "--k-mp-d": `${duration}s`, "--k-mp-delay": `${(-duration / items.length) * i}s` } as React.CSSProperties}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
