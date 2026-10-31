"use client";
import { useId, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@kinetik/core";

export interface RatingStarsProps {
  value?: number;
  defaultValue?: number;
  onChange?: (v: number) => void;
  max?: number;
  label?: string;
  className?: string;
}

/** Star rating as an accessible radio group; hovering previews, choosing pops the stars in sequence. */
export function RatingStars({ value: controlled, defaultValue = 0, onChange, max = 5, label = "Rating", className }: RatingStarsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const [hover, setHover] = useState(0);
  const [pop, setPop] = useState(0);
  const value = controlled ?? internal;
  const shown = hover || value;
  const name = useId();
  const set = (v: number) => {
    if (controlled === undefined) setInternal(v);
    onChange?.(v);
    setPop((p) => p + 1);
  };
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex gap-1", className)} onPointerLeave={() => setHover(0)}>
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const on = n <= shown;
        return (
          <label key={n} className="cursor-pointer" onPointerEnter={() => setHover(n)}>
            <input type="radio" name={name} value={n} checked={value === n} onChange={() => set(n)} className="peer sr-only" aria-label={`${n} star${n > 1 ? "s" : ""}`} />
            <motion.svg
              key={`${pop}-${n}`}
              viewBox="0 0 24 24"
              className="size-8 rounded peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
              initial={false}
              animate={n <= value && pop ? { scale: [1, 1.35, 1], rotate: [0, -12, 0] } : { scale: on ? 1.08 : 1 }}
              transition={{ duration: 0.4, delay: n <= value ? i * 0.06 : 0 }}
            >
              <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill={on ? "#facc15" : "transparent"} stroke={on ? "#eab308" : "currentColor"} strokeOpacity={on ? 1 : 0.35} strokeWidth="1.5" strokeLinejoin="round" className="transition-[fill] duration-150" />
            </motion.svg>
          </label>
        );
      })}
    </div>
  );
}
