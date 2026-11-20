"use client";
import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { Flame, Snowflake, Wind } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface WidgetThermostatProps {
  defaultTarget?: number;
  current?: number;
  min?: number;
  max?: number;
  className?: string;
}

const START = 135, SWEEP = 270; // degrees, gauge opens at the bottom

/**
 * Smart-thermostat dial: drag around the ring (or use the arrow keys) to set the target; the arc
 * fills and its gradient shifts from icy blue to ember orange, the big number ticks, and the mode
 * switches to heating, cooling or idle depending on the current room temperature, with a matching
 * glow that breathes.
 */
export function WidgetThermostat({ defaultTarget = 21, current = 19, min = 10, max = 30, className }: WidgetThermostatProps) {
  const reduced = useReducedMotion();
  const target = useMotionValue(defaultTarget);
  const [t, setT] = useState(defaultTarget);
  useMotionValueEvent(target, "change", (v) => setT(Math.round(v * 2) / 2));
  const frac = useTransform(target, [min, max], [0, 1]);
  const angle = useTransform(frac, (f) => START + f * SWEEP);
  const knobX = useTransform(angle, (a) => 100 + Math.cos((a * Math.PI) / 180) * 80);
  const knobY = useTransform(angle, (a) => 100 + Math.sin((a * Math.PI) / 180) * 80);
  const ARC = 2 * Math.PI * 80 * (SWEEP / 360);
  const dash = useTransform(frac, (f) => `${f * ARC} 999`);
  const mode = t > current + 0.4 ? "heat" : t < current - 0.4 ? "cool" : "idle";
  const glow = mode === "heat" ? "#f97316" : mode === "cool" ? "#38bdf8" : "#a1a1aa";
  const svg = useRef<SVGSVGElement>(null);

  const setFromPointer = (x: number, y: number) => {
    const b = svg.current!.getBoundingClientRect();
    let a = (Math.atan2(y - (b.top + b.height / 2), x - (b.left + b.width / 2)) * 180) / Math.PI;
    a = ((a - START) % 360 + 360) % 360;
    if (a > SWEEP) a = a - SWEEP < (360 - SWEEP) / 2 ? SWEEP : 0;
    target.set(Math.round((min + (a / SWEEP) * (max - min)) * 2) / 2);
  };
  const step = (d: number) => {
    const v = Math.max(min, Math.min(max, t + d));
    reduced ? target.set(v) : animate(target, v, { type: "spring", stiffness: 300, damping: 30 });
  };

  return (
    <div className={cn("relative w-[260px] rounded-[36px] bg-zinc-950 p-5 text-white shadow-2xl", className)}>
      <motion.div aria-hidden className="absolute inset-8 rounded-full blur-3xl" animate={{ backgroundColor: glow, opacity: reduced ? 0.25 : mode === "idle" ? 0.12 : [0.2, 0.38, 0.2] }} transition={{ duration: 2.4, repeat: reduced ? 0 : Infinity }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Target temperature"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={t}
        aria-valuetext={`${t} degrees, ${mode === "heat" ? "heating" : mode === "cool" ? "cooling" : "holding"}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowRight") (e.preventDefault(), step(0.5));
          if (e.key === "ArrowDown" || e.key === "ArrowLeft") (e.preventDefault(), step(-0.5));
        }}
        className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <svg
          ref={svg}
          viewBox="0 0 200 200"
          className="block w-full cursor-grab touch-none active:cursor-grabbing"
          onPointerDown={(e) => (e.currentTarget.setPointerCapture(e.pointerId), setFromPointer(e.clientX, e.clientY))}
          onPointerMove={(e) => e.buttons && setFromPointer(e.clientX, e.clientY)}
        >
          <defs>
            <linearGradient id="kn-thermo" x1="0" x2="1" y1="1" y2="0">
              <stop offset="0" stopColor="#38bdf8" />
              <stop offset=".5" stopColor="#a78bfa" />
              <stop offset="1" stopColor="#f97316" />
            </linearGradient>
          </defs>
          {Array.from({ length: 55 }, (_, i) => {
            const a = ((START + (i / 54) * SWEEP) * Math.PI) / 180;
            return <line key={i} x1={100 + Math.cos(a) * 94} y1={100 + Math.sin(a) * 94} x2={100 + Math.cos(a) * (i % 9 ? 90 : 87)} y2={100 + Math.sin(a) * (i % 9 ? 90 : 87)} stroke="#fff" strokeOpacity={i % 9 ? 0.18 : 0.45} strokeWidth="1" />;
          })}
          <circle r="80" cx="100" cy="100" fill="none" stroke="#fff" strokeOpacity=".08" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${ARC} 999`} transform={`rotate(${START} 100 100)`} />
          <motion.circle r="80" cx="100" cy="100" fill="none" stroke="url(#kn-thermo)" strokeWidth="12" strokeLinecap="round" style={{ strokeDasharray: dash }} transform={`rotate(${START} 100 100)`} />
          <motion.circle r="9" fill="#fff" style={{ cx: knobX, cy: knobY }} />
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">{mode === "heat" ? "Heating to" : mode === "cool" ? "Cooling to" : "Holding"}</p>
            <p className="font-mono text-5xl font-light tabular-nums">{t.toFixed(1)}<span className="text-2xl text-white/50">°</span></p>
            <p className="text-xs text-white/50">Inside {current}°</p>
          </div>
        </div>
      </div>
      <div className="relative mt-2 flex justify-center gap-2">
        {([["heat", Flame], ["idle", Wind], ["cool", Snowflake]] as const).map(([m, Icon]) => (
          <span key={m} className={cn("grid size-9 place-items-center rounded-full transition-colors", mode === m ? "bg-white text-black" : "bg-white/5 text-white/40")} aria-hidden>
            <Icon className="size-4" />
          </span>
        ))}
      </div>
    </div>
  );
}
