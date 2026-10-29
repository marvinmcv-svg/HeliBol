"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@kinetik/core";

export interface ChartBarGrowProps {
  data: { label: string; value: number; highlight?: boolean }[];
  height?: number;
  className?: string;
}

export function ChartBarGrow({ data, height = 200, className }: ChartBarGrowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref} role="img" aria-label={`Bar chart: ${data.map((d) => `${d.label} ${d.value}`).join(", ")}`} className={cn("flex w-full items-end gap-2", className)} style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
          <motion.span className="text-[11px] font-medium tabular-nums text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>{d.value}</motion.span>
          <motion.div
            className={cn("w-full origin-bottom rounded-t-lg", d.highlight ? "bg-gradient-to-t from-violet-600 to-fuchsia-400" : "bg-muted-foreground/25 group-hover:bg-muted-foreground/40")}
            style={{ height: `${(d.value / max) * 85}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: inView ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.06 }}
          />
          <span className="text-[11px] text-muted-foreground" aria-hidden>{d.label}</span>
        </div>
      ))}
    </div>
  );
}
