"use client";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

/** A cone of light switches on from a glowing bar at the top and illuminates the heading below (Linear-style section header). */
export function BgLamp({ children, color = "#22d3ee", className }: { children?: ReactNode; color?: string; className?: string }) {
  const reduced = useReducedMotion();
  const t = { duration: reduced ? 0 : 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const };
  return (
    <div className={cn("relative isolate flex flex-col items-center overflow-hidden bg-[#06080d]", className)}>
      <div aria-hidden className="relative h-56 w-full">
        <motion.div initial={{ opacity: 0.4, width: "8rem" }} whileInView={{ opacity: 1, width: "26rem" }} viewport={{ once: true }} transition={t} className="absolute top-0 right-1/2 h-56 [mask-image:linear-gradient(to_left,#000,transparent)]" style={{ backgroundImage: `conic-gradient(from 70deg at center top, ${color}, transparent, transparent)` }} />
        <motion.div initial={{ opacity: 0.4, width: "8rem" }} whileInView={{ opacity: 1, width: "26rem" }} viewport={{ once: true }} transition={t} className="absolute top-0 left-1/2 h-56 [mask-image:linear-gradient(to_right,#000,transparent)]" style={{ backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, ${color})` }} />
        <div className="absolute inset-x-0 top-24 h-40 bg-[#06080d] blur-2xl" />
        <motion.div initial={{ width: "6rem" }} whileInView={{ width: "18rem" }} viewport={{ once: true }} transition={t} className="absolute top-0 left-1/2 h-36 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl" style={{ background: color }} />
        <motion.div initial={{ width: "8rem" }} whileInView={{ width: "26rem" }} viewport={{ once: true }} transition={t} className="absolute top-0 left-1/2 h-0.5 -translate-x-1/2" style={{ background: color, boxShadow: `0 0 18px ${color}` }} />
      </div>
      <div className="relative -mt-24 px-6 pb-12 text-center">{children}</div>
    </div>
  );
}
