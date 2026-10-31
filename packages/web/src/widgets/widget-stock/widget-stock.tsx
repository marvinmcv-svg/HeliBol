"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Live ticker card: a streaming sparkline, a price that flashes green/red on change, and an animated delta badge. */
export function WidgetStock({ symbol, name, start = 182.4, className }: { symbol: string; name: string; start?: number; className?: string }) {
  const [series, setSeries] = useState(() => Array.from({ length: 40 }, (_, i) => start + Math.sin(i / 4) * 2 + i * 0.05));
  const prev = useRef(start);
  const reduced = useReducedMotion();
  useEffect(() => {
    const t = setInterval(() => setSeries((s) => [...s.slice(1), +(s[s.length - 1] + (Math.random() - 0.47) * 1.4).toFixed(2)]), 900);
    return () => clearInterval(t);
  }, []);
  const price = series[series.length - 1];
  const up = price >= prev.current;
  useEffect(() => void (prev.current = price), [price]);
  const delta = ((price - series[0]) / series[0]) * 100;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const pts = series.map((v, i) => `${(i / (series.length - 1)) * 200},${58 - ((v - min) / (max - min || 1)) * 54}`).join(" ");
  const pos = delta >= 0;
  return (
    <div className={cn("w-72 rounded-3xl border border-border bg-card p-4", className)}>
      <div className="flex items-start justify-between">
        <div><p className="font-semibold">{symbol}</p><p className="text-xs text-muted-foreground">{name}</p></div>
        <div className="text-right">
          <motion.p key={price} initial={reduced ? false : { backgroundColor: up ? "rgb(34 197 94 / .3)" : "rgb(239 68 68 / .3)" }} animate={{ backgroundColor: "rgb(0 0 0 / 0)" }} transition={{ duration: 0.8 }} className="rounded px-1 font-mono text-lg font-semibold tabular-nums" aria-live="off">${price.toFixed(2)}</motion.p>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={pos ? "u" : "d"} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={cn("inline-block rounded-md px-1.5 text-xs font-medium", pos ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-red-500/15 text-red-600 dark:text-red-400")}>{pos ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}%</motion.span>
          </AnimatePresence>
        </div>
      </div>
      <svg viewBox="0 0 200 60" className="mt-3 h-16 w-full" preserveAspectRatio="none" role="img" aria-label={`${symbol} price chart`}>
        <defs><linearGradient id={`k-stk-${symbol}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={pos ? "#22c55e" : "#ef4444"} stopOpacity=".3" /><stop offset="1" stopColor={pos ? "#22c55e" : "#ef4444"} stopOpacity="0" /></linearGradient></defs>
        <polygon points={`0,60 ${pts} 200,60`} fill={`url(#k-stk-${symbol})`} />
        <polyline points={pts} fill="none" stroke={pos ? "#22c55e" : "#ef4444"} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
