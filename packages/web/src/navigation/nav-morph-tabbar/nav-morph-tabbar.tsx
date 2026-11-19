"use client";
import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface NavMorphTab {
  label: string;
  icon: ReactNode;
  /** Accent for the active pill. */
  color?: string;
}

export interface NavMorphTabbarProps {
  tabs: NavMorphTab[];
  defaultIndex?: number;
  onChange?: (i: number) => void;
  className?: string;
}

/**
 * Mobile tab bar where the active tab grows into a coloured pill that reveals its label: the pill
 * slides (shared layout) and changes colour, the label unfurls letter-width by width, inactive icons
 * stay compact, and the icon does a little hop on select.
 */
export function NavMorphTabbar({ tabs, defaultIndex = 0, onChange, className }: NavMorphTabbarProps) {
  const reduced = useReducedMotion();
  const group = useId();
  const [active, setActive] = useState(defaultIndex);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 480, damping: 34 };
  return (
    <nav aria-label="Tabs" className={cn("inline-flex items-center gap-1 rounded-full bg-zinc-900 p-1.5 shadow-2xl", className)}>
      {tabs.map((tab, i) => {
        const on = i === active;
        return (
          <motion.button
            key={tab.label}
            layout
            transition={t}
            type="button"
            aria-current={on ? "page" : undefined}
            aria-label={tab.label}
            onClick={() => (setActive(i), onChange?.(i))}
            className={cn("relative flex h-11 items-center gap-2 rounded-full px-3.5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-white/60", on ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-100")}
          >
            {on && <motion.span layoutId={`${group}-pill`} transition={t} className="absolute inset-0 rounded-full" style={{ background: tab.color ?? "#fff" }} />}
            <motion.span key={on ? "on" : "off"} layout="position" className="relative grid size-5 place-items-center" initial={on && !reduced ? { y: -6 } : false} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 600, damping: 12 }}>
              {tab.icon}
            </motion.span>
            <AnimatePresence initial={false}>
              {on && (
                <motion.span
                  key="label"
                  className="relative overflow-hidden whitespace-nowrap"
                  initial={reduced ? { opacity: 0 } : { width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { width: 0, opacity: 0 }}
                  transition={t}
                >
                  {tab.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </nav>
  );
}
