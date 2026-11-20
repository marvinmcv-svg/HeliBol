"use client";
import { useEffect, useId, useRef, useState } from "react";
import { cn, useReducedMotion, useInView } from "@kinetik/core";

export interface RouteStop { label: string; /** 0–1 along the route */ at: number }
export interface SvgRouteMapProps {
  /** SVG path in a 400×260 viewBox. */
  route?: string;
  stops?: RouteStop[];
  /** Seconds for one trip. */
  duration?: number;
  /** Minutes the trip represents, for the ETA readout. */
  minutes?: number;
  className?: string;
}

const DEFAULT_ROUTE = "M30 220 C 80 220, 90 150, 140 150 S 200 70, 250 90 S 320 200, 370 40";
const DEFAULT_STOPS: RouteStop[] = [
  { label: "Depot", at: 0 },
  { label: "Market St", at: 0.33 },
  { label: "Harbour", at: 0.62 },
  { label: "You", at: 1 },
];

/**
 * Live-delivery map: a stylised street grid, the route draws itself, then a courier marker follows
 * the path (rotating to its heading) with a fading trail, stops light up as it passes and an ETA
 * counts down. Plays when scrolled into view and loops. Reduced motion shows the finished route.
 */
export function SvgRouteMap({ route = DEFAULT_ROUTE, stops = DEFAULT_STOPS, duration = 8, minutes = 18, className }: SvgRouteMapProps) {
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.3 });
  const path = useRef<SVGPathElement>(null);
  const [p, setP] = useState(reduced ? 1 : 0);
  const [pos, setPos] = useState({ x: 30, y: 220, a: 0 });
  const [stopPts, setStopPts] = useState<{ x: number; y: number }[]>([]);
  const len = useRef(0);

  useEffect(() => {
    const el = path.current;
    if (!el || typeof el.getTotalLength !== "function") return;
    len.current = el.getTotalLength();
    setStopPts(stops.map((s) => el.getPointAtLength(s.at * len.current)));
  }, [route, stops]);

  useEffect(() => {
    if (reduced) return setP(1);
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const cycle = ((now - t0) / 1000) % (duration + 1.5);
      setP(Math.min(1, cycle / duration));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, duration]);

  useEffect(() => {
    const el = path.current;
    if (!el || !len.current || typeof el.getPointAtLength !== "function") return;
    const e = ease(p);
    const a = el.getPointAtLength(e * len.current);
    const b = el.getPointAtLength(Math.min(len.current, e * len.current + 1));
    setPos({ x: a.x, y: a.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI });
  }, [p]);

  const e = ease(p);
  const eta = Math.max(0, Math.ceil(minutes * (1 - e)));
  return (
    <div ref={wrap} className={cn("relative overflow-hidden rounded-3xl border bg-[#0d1117] text-white", className)}>
      <svg viewBox="0 0 400 260" className="block w-full" role="img" aria-label={`Delivery route, ${eta} minutes away`}>
        <defs>
          <pattern id={`g-${id}`} width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
            <path d="M0 0H26M0 0V26" stroke="#ffffff" strokeOpacity=".06" strokeWidth="6" />
          </pattern>
          <linearGradient id={`r-${id}`} x1="0" x2="1">
            <stop offset="0" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <rect width="400" height="260" fill={`url(#g-${id})`} />
        <path d="M0 120 Q 120 90 220 130 T 400 110 V 160 Q 300 175 220 180 T 0 170Z" fill="#1e3a5f" opacity=".35" />
        <path d={route} stroke="#fff" strokeOpacity=".12" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path ref={path} d={route} stroke={`url(#r-${id})`} strokeWidth="4" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, e + 0.0001)} />
        {stopPts.map((s, i) => {
          const passed = e >= stops[i]!.at - 0.001;
          return (
            <g key={i} transform={`translate(${s.x} ${s.y})`}>
              {passed && !reduced && <circle r="12" fill="#22d3ee" opacity=".18"><animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" /></circle>}
              <circle r="5.5" fill={passed ? "#22d3ee" : "#0d1117"} stroke={passed ? "#fff" : "#ffffff55"} strokeWidth="2" />
              <text y={i % 2 ? 22 : -12} textAnchor="middle" fontSize="10" fill={passed ? "#fff" : "#ffffff80"} fontFamily="ui-sans-serif, system-ui">{stops[i]!.label}</text>
            </g>
          );
        })}
        {stopPts.length > 0 && (
          <g transform={`translate(${pos.x} ${pos.y}) rotate(${pos.a})`}>
            <circle r="11" fill="#fff" />
            <path d="M-4 -4 L5 0 L-4 4 Z" fill="#0d1117" />
          </g>
        )}
      </svg>
      <div className="absolute left-4 top-4 rounded-2xl bg-white/10 px-3 py-2 backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-widest text-white/60">Arriving in</p>
        <p className="font-mono text-2xl font-semibold tabular-nums">{eta === 0 ? "Here" : `${eta} min`}</p>
      </div>
    </div>
  );
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
