"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin, useGSAP);

export interface Waypoint {
  label: string;
  /** Position along the path, 0..1. */
  at: number;
  detail?: string;
}

export interface GsapPathWaypointsProps {
  waypoints: Waypoint[];
  /** Path in a 0..600 × 0..300 viewBox. */
  d?: string;
  className?: string;
}

const ROUTE = "M30,250 C120,250 110,60 220,70 S330,240 410,200 S470,40 570,50";

/**
 * A marker travels a winding route between waypoints (MotionPathPlugin with `start`/`end`
 * so it can go to any stop from wherever it is, autoRotate to face the road) while the
 * travelled part of the route draws itself with DrawSVG.
 */
export function GsapPathWaypoints({ waypoints, d = ROUTE, className }: GsapPathWaypointsProps) {
  const root = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const path = q("[data-route]")[0] as unknown as SVGPathElement;
      q("[data-stop]").forEach((el, i) => {
        if (typeof path?.getTotalLength !== "function") return;
        const p = path.getPointAtLength(path.getTotalLength() * waypoints[i].at);
        if (p) gsap.set(el, { x: p.x, y: p.y });
      });
      gsap.set(q("[data-trail]"), { drawSVG: "0%" });
      place(waypoints[0].at, 0);
    },
    { scope: root },
  );

  const place = contextSafe((at: number, dur: number) => {
    const q = gsap.utils.selector(root);
    const from = pos.current;
    pos.current = at;
    const route = q("[data-route]")[0] as unknown as SVGPathElement;
    // no SVG layout (SSR / jsdom): nothing to measure
    if (typeof route?.getCTM !== "function" || typeof route.getTotalLength !== "function") return;
    gsap.to(q("[data-marker]"), {
      motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], autoRotate: true, start: from, end: at },
      duration: reduced ? 0 : dur,
      ease: "power2.inOut",
      overwrite: true,
    });
    gsap.to(q("[data-trail]"), { drawSVG: `0% ${at * 100}%`, duration: reduced ? 0 : dur, ease: "power2.inOut", overwrite: true });
  });

  const go = (i: number) => {
    setActive(i);
    place(waypoints[i].at, 0.6 + Math.abs(waypoints[i].at - pos.current) * 2.2);
  };

  return (
    <div ref={root} className={cn("w-full", className)}>
      <svg viewBox="0 0 600 300" className="w-full overflow-visible" role="img" aria-label={`Route, currently at ${waypoints[active].label}`}>
        <path data-route d={d} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="10" strokeLinecap="round" />
        <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 8" />
        <path data-trail d={d} fill="none" stroke="#8b5cf6" strokeWidth="5" strokeLinecap="round" />
        {waypoints.map((w, i) => (
          <g key={w.label} data-stop>
            <circle r="9" fill="var(--background, #000)" stroke={i <= active ? "#8b5cf6" : "currentColor"} strokeOpacity={i <= active ? 1 : 0.4} strokeWidth="3" />
            <text y="-18" textAnchor="middle" fontSize="13" fill="currentColor" opacity={i === active ? 1 : 0.55}>{w.label}</text>
          </g>
        ))}
        <g data-marker>
          <path d="M-12,-9 L14,0 L-12,9 L-6,0 Z" fill="#f59e0b" />
        </g>
      </svg>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {waypoints.map((w, i) => (
          <button key={w.label} onClick={() => go(i)} aria-pressed={active === i} className={cn("rounded-full border px-3 py-1 text-xs transition-colors", active === i ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground")}>
            {w.label}
          </button>
        ))}
      </div>
      {waypoints[active].detail && <p className="mt-2 text-center text-xs text-muted-foreground">{waypoints[active].detail}</p>}
    </div>
  );
}
