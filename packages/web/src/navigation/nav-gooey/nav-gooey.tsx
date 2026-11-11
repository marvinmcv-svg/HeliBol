"use client";
import { useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface NavGooeyItem {
  label: string;
  icon: ReactNode;
}

export interface NavGooeyProps {
  items: NavGooeyItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

/**
 * Tab bar whose active blob oozes between items: an SVG "goo" filter (blur + alpha threshold) merges
 * the moving blob with a trailing droplet, so they stretch and pinch like liquid.
 */
export function NavGooey({ items, defaultIndex = 0, onChange, className }: NavGooeyProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(defaultIndex);
  const filterId = `goo-${useId().replace(/:/g, "")}`;
  const pct = (i: number) => `${(i + 0.5) * (100 / items.length)}%`;

  return (
    <nav aria-label="Primary" className={cn("relative rounded-full bg-zinc-900 p-2 text-zinc-400 shadow-xl", className)}>
      <svg aria-hidden className="absolute size-0">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
      {/* goo layer: blob + droplet, filtered together */}
      <div aria-hidden className="pointer-events-none absolute inset-2" style={{ filter: reduced ? undefined : `url(#${filterId})` }}>
        <motion.span
          className="absolute top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500"
          animate={{ left: pct(active) }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 24 }}
        />
        <motion.span
          className="absolute top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500"
          animate={{ left: pct(active) }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 14 }}
        />
      </div>
      <ul className="relative grid" style={{ gridTemplateColumns: `repeat(${items.length}, 4rem)` }}>
        {items.map((it, i) => (
          <li key={it.label}>
            <button
              type="button"
              aria-label={it.label}
              aria-current={i === active ? "page" : undefined}
              onClick={() => (setActive(i), onChange?.(i))}
              className={cn("grid h-12 w-16 place-items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300", i === active ? "text-white" : "hover:text-zinc-200")}
            >
              {it.icon}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
