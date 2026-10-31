"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** 3D cover flow: the centered item faces you, neighbours rotate away in perspective; click, swipe or use arrow keys. */
export function Coverflow({ items, className }: { items: { src: string; title: string }[]; className?: string }) {
  const [i, setI] = useState(Math.floor(items.length / 2));
  const go = (n: number) => setI(Math.max(0, Math.min(items.length - 1, n)));
  return (
    <div
      tabIndex={0}
      role="listbox"
      aria-label="Albums"
      aria-activedescendant={`cf-${i}`}
      onKeyDown={(e) => (e.key === "ArrowRight" ? go(i + 1) : e.key === "ArrowLeft" ? go(i - 1) : null)}
      className={cn("relative flex h-72 items-center justify-center overflow-hidden outline-none [perspective:1100px] focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <motion.div className="relative h-48 w-48 [transform-style:preserve-3d]" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={(_, d) => (d.offset.x < -40 ? go(i + 1) : d.offset.x > 40 ? go(i - 1) : null)}>
        {items.map((it, n) => {
          const o = n - i;
          return (
            <motion.button
              key={it.src}
              id={`cf-${n}`}
              role="option"
              aria-selected={o === 0}
              aria-label={it.title}
              onClick={() => go(n)}
              className="absolute inset-0 overflow-hidden rounded-xl shadow-2xl"
              animate={{ x: o === 0 ? 0 : o * 70 + Math.sign(o) * 70, z: o === 0 ? 80 : -Math.abs(o) * 40, rotateY: o === 0 ? 0 : -Math.sign(o) * 58, opacity: Math.abs(o) > 4 ? 0 : 1 }}
              transition={spring.smooth}
              style={{ zIndex: 100 - Math.abs(o) }}
            >
              <img src={it.src} alt="" className="h-full w-full object-cover" draggable={false} />
              <span className="pointer-events-none absolute inset-x-0 -bottom-full block h-full scale-y-[-1] bg-gradient-to-b from-white/20 to-transparent" />
            </motion.button>
          );
        })}
      </motion.div>
      <p className="absolute bottom-2 text-sm font-medium">{items[i].title}</p>
    </div>
  );
}
