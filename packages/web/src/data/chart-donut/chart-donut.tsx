"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@kinetik/core";

/** Donut chart whose segments sweep in sequence on view; hovering a segment or legend item lifts it and updates the center. */
export function ChartDonut({ data, label = "Total", className }: { data: { label: string; value: number; color: string }[]; label?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [hot, setHot] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  let acc = 0;
  const gap = 0.006;
  return (
    <div ref={ref} className={cn("flex items-center gap-6", className)}>
      <div className="relative size-44">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" role="img" aria-label={data.map((d) => `${d.label} ${Math.round((d.value / total) * 100)}%`).join(", ")}>
          {data.map((d, i) => {
            const frac = d.value / total;
            const start = acc;
            acc += frac;
            return (
              <motion.circle
                key={d.label}
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke={d.color}
                strokeWidth={hot === i ? 14 : 11}
                pathLength={1}
                strokeDasharray={`${Math.max(0, frac - gap)} 1`}
                initial={{ strokeDashoffset: 0, opacity: 0 }}
                animate={inView ? { strokeDashoffset: -start, opacity: hot === null || hot === i ? 1 : 0.35 } : {}}
                transition={{ strokeDashoffset: { delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.2 } }}
                style={{ transition: "stroke-width .2s" }}
                onPointerEnter={() => setHot(i)}
                onPointerLeave={() => setHot(null)}
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div><p className="text-2xl font-semibold tabular-nums">{hot === null ? total.toLocaleString() : `${Math.round((data[hot].value / total) * 100)}%`}</p><p className="text-xs text-muted-foreground">{hot === null ? label : data[hot].label}</p></div>
        </div>
      </div>
      <ul className="space-y-1.5 text-sm">
        {data.map((d, i) => (
          <li key={d.label} onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(null)} className={cn("flex items-center gap-2 rounded-md px-1.5 transition-opacity", hot !== null && hot !== i && "opacity-40")}>
            <span className="size-2.5 rounded-full" style={{ background: d.color }} />{d.label}<span className="ml-3 text-muted-foreground tabular-nums">{d.value.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
