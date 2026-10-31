"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Floating action button that blooms into a radial (or vertical) set of actions with staggered springs. */
export function NavSpeedDial({ actions, layout = "radial", className }: { actions: { icon: ReactNode; label: string; onClick?: () => void }[]; layout?: "radial" | "vertical"; className?: string }) {
  const [open, setOpen] = useState(false);
  const n = actions.length;
  return (
    <div className={cn("relative grid size-14 place-items-center", className)} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <AnimatePresence>
        {open &&
          actions.map((a, i) => {
            const ang = (-90 - 75 + (150 / Math.max(1, n - 1)) * i) * (Math.PI / 180);
            const pos = layout === "radial" ? { x: Math.cos(ang) * 88, y: Math.sin(ang) * 88 } : { x: 0, y: -(i + 1) * 58 };
            return (
              <motion.button key={a.label} aria-label={a.label} title={a.label} onClick={() => (a.onClick?.(), setOpen(false))} initial={{ x: 0, y: 0, scale: 0, opacity: 0 }} animate={{ ...pos, scale: 1, opacity: 1 }} exit={{ x: 0, y: 0, scale: 0, opacity: 0, transition: { duration: 0.15, delay: (n - i) * 0.02 } }} transition={{ ...spring.bouncy, delay: i * 0.04 }} className="absolute grid size-11 place-items-center rounded-full border border-border bg-card shadow-lg hover:bg-accent [&>svg]:size-5">
                {a.icon}
              </motion.button>
            );
          })}
      </AnimatePresence>
      <motion.button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Close actions" : "Open actions"} animate={{ rotate: open ? 135 : 0 }} transition={spring.snappy} className="relative z-10 grid size-14 place-items-center rounded-full bg-foreground text-background shadow-xl">
        <Plus className="size-6" />
      </motion.button>
    </div>
  );
}
