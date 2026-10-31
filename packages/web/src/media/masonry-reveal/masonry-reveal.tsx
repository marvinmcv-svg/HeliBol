"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Pinterest-style masonry (CSS columns) whose tiles rise and unblur in a staggered wave as they enter view. */
export function MasonryReveal({ items, columns = 3, className }: { items: { src: string; alt: string; ratio: number }[]; columns?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("gap-3", className)} style={{ columnCount: columns }}>
      {items.map((it, i) => (
        <motion.figure
          key={i}
          className="mb-3 break-inside-avoid overflow-hidden rounded-2xl"
          initial={reduced ? false : { opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: (i % columns) * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={it.src} alt={it.alt} className="w-full object-cover transition-transform duration-700 hover:scale-105" style={{ aspectRatio: it.ratio }} />
        </motion.figure>
      ))}
    </div>
  );
}
