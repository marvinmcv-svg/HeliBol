"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Plane } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface WidgetFlightProps {
  from: { code: string; city: string; time: string };
  to: { code: string; city: string; time: string };
  flight: string;
  /** 0–1 progress of the flight. Omit to simulate a live flight. */
  progress?: number;
  className?: string;
}

// px coordinates in a fixed 280×84 box so the SVG route and the CSS offset-path line up exactly
const ARC = "M14 76 Q 140 -8 266 76";

/**
 * Live flight widget: the plane glides along a curved route (offset-path), banking with the arc,
 * the flown part of the route fills in, a dotted contrail fades behind it, and time remaining
 * counts down. Pass `progress` from your data, or leave it to simulate.
 */
export function WidgetFlight({ from, to, flight, progress, className }: WidgetFlightProps) {
  const reduced = useReducedMotion();
  const [sim, setSim] = useState(0.18);
  useEffect(() => {
    if (progress !== undefined || reduced) return;
    const id = setInterval(() => setSim((p) => (p >= 0.98 ? 0.05 : p + 0.004)), 120);
    return () => clearInterval(id);
  }, [progress, reduced]);
  const p = progress ?? sim;
  const total = 165; // minutes
  const left = Math.round(total * (1 - p));
  return (
    <div className={cn("w-80 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-5 text-white shadow-2xl", className)} role="group" aria-label={`Flight ${flight} from ${from.city} to ${to.city}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="rounded-full bg-white/20 px-2 py-0.5 font-semibold">{flight}</span>
        <span className="text-white/80">In flight · <span className="tabular-nums">{Math.floor(left / 60)}h {String(left % 60).padStart(2, "0")}m</span> left</span>
      </div>
      <div className="relative mx-auto mt-3 h-[84px] w-[280px]">
        <svg width="280" height="84" viewBox="0 0 280 84" className="absolute inset-0 overflow-visible" aria-hidden>
          <path d={ARC} fill="none" stroke="rgb(255 255 255 / .3)" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
          <motion.path d={ARC} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" initial={false} animate={{ pathLength: p }} transition={{ duration: reduced ? 0 : 0.4 }} />
          <circle cx="14" cy="76" r="4" fill="white" />
          <circle cx="266" cy="76" r="4" fill="none" stroke="white" strokeWidth="2" />
        </svg>
        <motion.span
          aria-hidden
          className="absolute left-0 top-0 grid place-items-center rounded-full bg-white text-indigo-600 shadow-lg"
          style={{ offsetPath: `path("${ARC}")`, offsetRotate: "auto 45deg", width: 28, height: 28 }}
          initial={false}
          animate={{ offsetDistance: `${p * 100}%` }}
          transition={{ duration: reduced ? 0 : 0.4, ease: "linear" }}
        >
          <Plane className="size-4 fill-current" />
        </motion.span>
      </div>
      <div className="mt-1 flex justify-between">
        <div><p className="text-3xl font-bold tracking-tight">{from.code}</p><p className="text-xs text-white/75">{from.city} · {from.time}</p></div>
        <div className="text-right"><p className="text-3xl font-bold tracking-tight">{to.code}</p><p className="text-xs text-white/75">{to.city} · {to.time}</p></div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)} aria-label="Flight progress">
        <motion.div className="h-full rounded-full bg-white" initial={false} animate={{ width: `${p * 100}%` }} />
      </div>
    </div>
  );
}
