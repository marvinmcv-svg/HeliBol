"use client";
import { useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Mobile bottom tab bar: a sliding pill indicator, the active icon bounces, and its label expands inline. */
export function NavBottomBar({ items, className }: { items: { icon: ReactNode; label: string }[]; className?: string }) {
  const [active, setActive] = useState(0);
  const id = useId();
  return (
    <nav className={cn("flex items-center gap-1 rounded-full border border-border bg-card/90 p-1.5 shadow-xl backdrop-blur", className)} role="tablist">
      {items.map((it, i) => {
        const on = i === active;
        return (
          <button key={it.label} role="tab" aria-selected={on} aria-label={it.label} onClick={() => setActive(i)} className={cn("relative flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium", on ? "text-background" : "text-muted-foreground")}>
            {on && <motion.span layoutId={id} transition={spring.smooth} className="absolute inset-0 rounded-full bg-foreground" />}
            <motion.span key={`${on}-${i}`} className="relative [&>svg]:size-5" animate={on ? { y: [0, -5, 0], rotate: [0, -10, 0] } : {}} transition={{ duration: 0.4 }}>{it.icon}</motion.span>
            {on && <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} transition={spring.smooth} className="relative overflow-hidden whitespace-nowrap">{it.label}</motion.span>}
          </button>
        );
      })}
    </nav>
  );
}
