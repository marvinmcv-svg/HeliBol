"use client";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** Integration orbits: icons circle a center logo on concentric rings at different speeds (icons stay upright). */
export function OrbitIcons({ center, rings, className }: { center: ReactNode; rings: { radius: number; duration: number; reverse?: boolean; icons: ReactNode[] }[]; className?: string }) {
  const reduced = useReducedMotion();
  const max = Math.max(...rings.map((r) => r.radius));
  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: max * 2 + 60, height: max * 2 + 60 }}>
      {rings.map((r, ri) => (
        <motion.div key={ri} className="absolute rounded-full border border-dashed border-border" style={{ width: r.radius * 2, height: r.radius * 2 }} animate={reduced ? {} : { rotate: r.reverse ? -360 : 360 }} transition={{ duration: r.duration, repeat: Infinity, ease: "linear" }}>
          {r.icons.map((ic, i) => {
            const a = (i / r.icons.length) * Math.PI * 2;
            return (
              <motion.span key={i} className="absolute grid size-10 -translate-1/2 place-items-center rounded-full border border-border bg-card shadow-md [&>svg]:size-5" style={{ left: `${50 + Math.cos(a) * 50}%`, top: `${50 + Math.sin(a) * 50}%` }} animate={reduced ? {} : { rotate: r.reverse ? 360 : -360 }} transition={{ duration: r.duration, repeat: Infinity, ease: "linear" }}>
                {ic}
              </motion.span>
            );
          })}
        </motion.div>
      ))}
      <div className="relative z-10 grid size-16 place-items-center rounded-2xl bg-foreground text-background shadow-xl">{center}</div>
    </div>
  );
}
