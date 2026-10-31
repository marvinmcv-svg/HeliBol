"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextOdometerProps {
  value: number;
  format?: Intl.NumberFormatOptions;
  locale?: string;
  className?: string;
}

function Digit({ d, reduced }: { d: number; reduced: boolean }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden leading-none">
      <motion.span className="absolute inset-x-0 top-0 flex flex-col" initial={false} animate={{ y: `${-d * 10}%` }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 22 }}>
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1em] text-center">{n}</span>
        ))}
      </motion.span>
    </span>
  );
}

/** Each digit is a vertical reel that springs to its new number — the car-odometer / slot-machine counter. */
export function TextOdometer({ value, format, locale, className }: TextOdometerProps) {
  const reduced = useReducedMotion();
  const text = new Intl.NumberFormat(locale, format).format(value);
  return (
    <span className={cn("inline-flex items-baseline tabular-nums", className)} aria-label={text} role="text">
      {Array.from(text).map((ch, i) =>
        /\d/.test(ch) ? <Digit key={`${text.length - i}`} d={Number(ch)} reduced={reduced} /> : <span key={`s${text.length - i}`} aria-hidden>{ch}</span>,
      )}
    </span>
  );
}
