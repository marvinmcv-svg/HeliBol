"use client";
import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useMotionValueEvent } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { durationS, easeBezier } from "@kinetik/tokens";

export interface NumberTickerProps {
  value: number;
  from?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  locale?: string;
  prefix?: string;
  suffix?: string;
  format?: Intl.NumberFormatOptions;
  className?: string;
}

export function NumberTicker({
  value,
  from = 0,
  duration = durationS.cinematic * 1.5,
  delay = 0,
  decimals = 0,
  locale,
  prefix = "",
  suffix = "",
  format,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const mv = useMotionValue(from);
  const fmt = new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals, ...format });

  useMotionValueEvent(mv, "change", (v) => {
    if (ref.current) ref.current.textContent = prefix + fmt.format(v) + suffix;
  });

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      mv.jump(value);
      return;
    }
    const controls = animate(mv, value, { duration, delay, ease: easeBezier.expoOut });
    return () => controls.stop();
  }, [inView, value, reduced, duration, delay, mv]);

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)}>
      {prefix + fmt.format(reduced ? value : from) + suffix}
    </span>
  );
}
