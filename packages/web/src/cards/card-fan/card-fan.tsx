"use client";
import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** A neat stack of cards that fans out on hover/focus, each card lifting individually under the pointer. */
export function CardFan({ items, className }: { items: ReactNode[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const [hot, setHot] = useState<number | null>(null);
  const n = items.length;
  return (
    <div
      className={cn("relative h-64 w-48", className)}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => (setOpen(false), setHot(null))}
      onFocus={() => setOpen(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      {items.map((item, i) => {
        const mid = (n - 1) / 2;
        const off = i - mid;
        return (
          <motion.div
            key={i}
            tabIndex={0}
            onPointerEnter={() => setHot(i)}
            className="absolute inset-0 origin-bottom rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            animate={open ? { rotate: off * 11, x: off * 58, y: Math.abs(off) * 10 - (hot === i ? 28 : 0), scale: hot === i ? 1.05 : 1 } : { rotate: off * 2, x: 0, y: 0, scale: 1 }}
            transition={spring.smooth}
            style={{ zIndex: hot === i ? 50 : i }}
          >
            {item}
          </motion.div>
        );
      })}
    </div>
  );
}
