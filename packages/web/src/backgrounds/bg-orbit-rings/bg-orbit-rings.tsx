"use client";
import type { ReactNode } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface BgOrbitRingsProps {
  children?: ReactNode;
  /** Number of rings. */
  rings?: number;
  /** Planet colours, one per ring (cycles). */
  colors?: string[];
  className?: string;
}

/**
 * A tilted solar-system backdrop: concentric dashed orbits around a glowing core, each spinning at
 * its own speed and direction, each carrying a glowing planet with a fading comet tail. The whole
 * system is tilted in 3D so the orbits read as ellipses. Pure SVG + CSS keyframes.
 */
export function BgOrbitRings({ children, rings = 5, colors = ["#a78bfa", "#22d3ee", "#f472b6", "#facc15", "#34d399"], className }: BgOrbitRingsProps) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_55%,#1e1b4b_0%,#05050a_65%)]", className)}>
      <style>{`@keyframes kn-orb{to{transform:rotate(360deg)}}`}</style>
      <div aria-hidden className="absolute inset-0" style={{ perspective: 2400 }}>
      <div className="absolute left-1/2 top-[58%] aspect-square w-[115%] max-w-[1100px]" style={{ transform: "translate(-50%,-50%) rotateX(62deg)" }}>
        <svg viewBox="-500 -500 1000 1000" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <radialGradient id="kn-orb-core"><stop offset="0" stopColor="#fff" /><stop offset=".25" stopColor="#c4b5fd" /><stop offset="1" stopColor="#7c3aed" stopOpacity="0" /></radialGradient>
          </defs>
          <circle r="90" fill="url(#kn-orb-core)" />
          {Array.from({ length: rings }, (_, i) => {
            const r = 130 + i * 72, c = colors[i % colors.length]!, dur = 14 + i * 7, dir = i % 2 ? "reverse" : "normal";
            return (
              <g key={i}>
                <circle r={r} fill="none" stroke="#fff" strokeOpacity={0.14 - i * 0.015} strokeDasharray={i % 2 ? "2 10" : "none"} />
                <g style={reduced ? { transform: `rotate(${i * 67}deg)` } : { animation: `kn-orb ${dur}s linear ${-((i * 67) / 360) * dur}s infinite ${dir}` }}>
                  <circle r={r} fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${r * 0.6} ${r * 10}`} strokeOpacity=".55" transform={dir === "reverse" ? undefined : "scale(1,-1)"} /* tail trails behind the planet */ style={{ filter: `drop-shadow(0 0 6px ${c})` }} />
                  <circle cx={r} cy="0" r={7 - i * 0.6} fill={c} style={{ filter: `drop-shadow(0 0 10px ${c})` }} />
                </g>
              </g>
            );
          })}
        </svg>
      </div>
      </div>
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}
