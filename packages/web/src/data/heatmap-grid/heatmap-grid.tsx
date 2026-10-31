"use client";
import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@kinetik/core";

/** GitHub-style contribution heatmap whose cells fill in a diagonal wave on view, with a hover readout. */
export function HeatmapGrid({ weeks = 26, seed = 7, color = "34 197 94", className }: { weeks?: number; seed?: number; color?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hot, setHot] = useState<{ w: number; d: number; v: number } | null>(null);
  const data = useMemo(() => Array.from({ length: weeks * 7 }, (_, i) => {
    const x = Math.sin(i * 12.9898 + seed) * 43758.5453;
    const r = x - Math.floor(x);
    return r < 0.3 ? 0 : Math.ceil(r * 4);
  }), [weeks, seed]);
  const total = data.reduce((s, v) => s + v, 0);
  return (
    <div ref={ref} className={cn("inline-block", className)}>
      <div className="grid grid-flow-col grid-rows-7 gap-[3px]" role="img" aria-label={`${total} contributions in the last ${weeks} weeks`} onPointerLeave={() => setHot(null)}>
        {data.map((v, i) => {
          const w = Math.floor(i / 7);
          const d = i % 7;
          return <motion.span key={i} onPointerEnter={() => setHot({ w, d, v })} className="size-3 rounded-[3px]" style={{ background: v ? `rgb(${color} / ${0.25 + v * 0.19})` : "color-mix(in oklab, var(--color-foreground, #888) 8%, transparent)" }} initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ delay: (w + d) * 0.015, type: "spring", stiffness: 400, damping: 22 }} />;
        })}
      </div>
      <p className="mt-2 h-4 text-xs text-muted-foreground">{hot ? `${hot.v * 3} contributions · week ${hot.w + 1}, day ${hot.d + 1}` : `${total * 3} contributions in the last ${weeks} weeks`}</p>
    </div>
  );
}
