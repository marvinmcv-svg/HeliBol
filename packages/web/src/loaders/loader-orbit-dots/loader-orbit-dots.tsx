"use client";
import { cn, useReducedMotion } from "@kinetik/core";

export interface LoaderOrbitDotsProps {
  size?: number;
  /** Number of dots per ring. */
  dots?: number;
  color?: string;
  label?: string;
  className?: string;
}

/**
 * Three tilted orbits of dots that spin at different speeds and directions, like an atom.
 * Pure CSS 3D (preserve-3d + keyframes) — no JS per frame. Each dot fades as it passes "behind".
 * Reduced motion shows the static gyroscope.
 */
export function LoaderOrbitDots({ size = 72, dots = 8, color = "currentColor", label = "Loading", className }: LoaderOrbitDotsProps) {
  const reduced = useReducedMotion();
  const rings = [
    { tilt: "rotateX(70deg)", dur: 1.6, dir: "normal" },
    { tilt: "rotateX(70deg) rotateY(60deg)", dur: 2.2, dir: "reverse" },
    { tilt: "rotateX(70deg) rotateY(-60deg)", dur: 2.8, dir: "normal" },
  ];
  return (
    <div role="status" aria-label={label} className={cn("relative", className)} style={{ width: size, height: size, perspective: size * 6, color }}>
      <style>{`@keyframes kn-orbit{to{transform:rotateZ(360deg)}}@keyframes kn-orbit-core{50%{transform:scale(.7);opacity:.6}}`}</style>
      <span className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 size-3 rounded-full bg-current" style={{ animation: reduced ? undefined : "kn-orbit-core 1.4s ease-in-out infinite" }} />
      {rings.map((r, i) => (
        <div key={i} className="absolute inset-0" style={{ transform: r.tilt, transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 rounded-full" style={{ border: "1px solid currentColor", opacity: 0.12 }} />
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", animation: reduced ? undefined : `kn-orbit ${r.dur}s linear infinite ${r.dir}` }}>
            {Array.from({ length: dots }, (_, d) => {
              const a = (d / dots) * Math.PI * 2;
              return (
                <span
                  key={d}
                  className="absolute size-1.5 rounded-full bg-current"
                  style={{ left: `calc(50% + ${Math.cos(a) * 50}% - 3px)`, top: `calc(50% + ${Math.sin(a) * 50}% - 3px)`, opacity: 0.25 + 0.75 * (d / dots) }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
