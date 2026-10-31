"use client";
import { useMemo, type ReactNode } from "react";
import { cn } from "@kinetik/core";

const css = `
.k-topo path{stroke-dasharray:6 10;animation:k-topo 30s linear infinite}
@keyframes k-topo{to{stroke-dashoffset:-320}}
@media (prefers-reduced-motion:reduce){.k-topo path{animation:none}}
[data-reduce-motion] .k-topo path{animation:none}`;

/** Contour-map lines (procedurally generated) with slowly marching dashes — for outdoor, maps and data brands. */
export function BgTopography({ children, lines = 14, className }: { children?: ReactNode; lines?: number; className?: string }) {
  const paths = useMemo(
    () =>
      Array.from({ length: lines }, (_, i) => {
        const pts: string[] = [];
        const r = 30 + i * 22;
        for (let a = 0; a <= 360; a += 10) {
          const rad = (a * Math.PI) / 180;
          const wob = Math.sin(rad * 3 + i * 0.7) * (8 + i * 1.2) + Math.cos(rad * 5 - i) * 6;
          pts.push(`${(400 + Math.cos(rad) * (r + wob) * 1.5).toFixed(1)},${(260 + Math.sin(rad) * (r + wob)).toFixed(1)}`);
        }
        return `M${pts.join("L")}Z`;
      }),
    [lines],
  );
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-topo" precedence="kinetik">{css}</style>
      <svg aria-hidden viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" className="k-topo absolute inset-0 -z-10 h-full w-full text-emerald-500/40">
        {paths.map((d, i) => <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={i % 4 === 0 ? 1.4 : 0.8} style={{ animationDuration: `${24 + i * 3}s` }} />)}
      </svg>
      {children}
    </div>
  );
}
