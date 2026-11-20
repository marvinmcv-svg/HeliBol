"use client";
import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { cn, useInView, useReducedMotion } from "@kinetik/core";

export interface GaugeZone { to: number; color: string }
export interface ChartGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  zones?: GaugeZone[];
  className?: string;
}

const A0 = -120, A1 = 120;

/**
 * Speedometer gauge with a weighted needle: on view (and whenever the value changes) the needle
 * sweeps past the target and settles with a damped wobble, the active zone of the coloured track
 * lights up, and the readout counts. Zones are configurable.
 */
export function ChartGauge({ value, min = 0, max = 100, label = "Score", unit = "", zones = [{ to: 40, color: "#ef4444" }, { to: 70, color: "#f59e0b" }, { to: 100, color: "#22c55e" }], className }: ChartGaugeProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.5 });
  const v = useMotionValue(reduced ? value : min);
  const rot = useTransform(v, [min, max], [A0, A1], { clamp: false });
  const shown = useTransform(v, (x) => `${Math.round(Math.max(min, Math.min(max, x)))}${unit}`);
  useEffect(() => {
    if (reduced) return v.set(value);
    if (!inView) return;
    const c = animate(v, value, { type: "spring", stiffness: 60, damping: 7, mass: 1.2 });
    return () => c.stop();
  }, [value, inView, reduced, v]);
  const pt = (a: number, r: number) => [100 + Math.sin((a * Math.PI) / 180) * r, 110 - Math.cos((a * Math.PI) / 180) * r] as const;
  const arc = (from: number, to: number, r: number) => {
    const [x0, y0] = pt(from, r), [x1, y1] = pt(to, r);
    return `M${x0} ${y0} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const ang = (x: number) => A0 + ((x - min) / (max - min)) * (A1 - A0);
  const active = zones.findIndex((z) => value <= z.to);

  return (
    <div ref={box} className={cn("w-72 rounded-3xl border bg-card p-5", className)}>
      <svg viewBox="0 0 200 150" className="w-full" role="img" aria-label={`${label}: ${value}${unit} of ${max}`}>
        {zones.map((z, i) => {
          const from = ang(i ? zones[i - 1]!.to : min) + (i ? 1.5 : 0), to = ang(z.to);
          return <path key={i} d={arc(from, to, 80)} fill="none" stroke={z.color} strokeWidth="14" strokeLinecap={i === 0 || i === zones.length - 1 ? "round" : "butt"} opacity={i === active ? 1 : 0.25} style={{ transition: "opacity .4s" }} />;
        })}
        {Array.from({ length: 11 }, (_, i) => {
          const a = A0 + (i / 10) * (A1 - A0), [x0, y0] = pt(a, 64), [x1, y1] = pt(a, i % 5 ? 60 : 56);
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} className="stroke-muted-foreground" strokeWidth={i % 5 ? 1 : 2} />;
        })}
        <motion.g style={{ rotate: rot, originX: 0.5, originY: 1 }} /* motion measures SVG origins from the element's own box: bottom-centre = pivot */>
          <path d="M97 110 L100 40 L103 110 Z" className="fill-foreground" />
        </motion.g>
        <circle cx="100" cy="110" r="9" className="fill-foreground" />
        <circle cx="100" cy="110" r="3.5" className="fill-card" />
      </svg>
      <div className="-mt-6 text-center">
        <motion.p className="font-mono text-3xl font-semibold tabular-nums">{shown}</motion.p>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
