"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface MegaItem {
  label: string;
  content: ReactNode;
}

/** Stripe-style mega menu: one shared panel that morphs its size and slides its content in the direction you move between triggers. */
export function NavMegaMenu({ items, className }: { items: MegaItem[]; className?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const prev = useRef<number | null>(null);
  const id = useId();
  const dir = active !== null && prev.current !== null ? Math.sign(active - prev.current) : 0;
  const open = (i: number) => {
    prev.current = active;
    setActive(i);
  };
  return (
    <nav className={cn("relative", className)} onPointerLeave={() => setActive(null)} onKeyDown={(e) => e.key === "Escape" && setActive(null)}>
      <ul className="flex gap-1">
        {items.map((it, i) => (
          <li key={it.label}>
            <button onPointerEnter={() => open(i)} onFocus={() => open(i)} onClick={() => (active === i ? setActive(null) : open(i))} aria-expanded={active === i} aria-controls={`${id}-panel`} className={cn("flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors", active === i ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {it.label}
              <ChevronDown className={cn("size-3.5 transition-transform", active === i && "rotate-180")} />
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {active !== null && (
          <motion.div id={`${id}-panel`} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={spring.smooth} className="absolute top-full left-0 z-30 pt-2">
            <motion.div layout transition={spring.smooth} className="overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.div key={active} custom={dir} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }} transition={spring.smooth} className="p-4">
                  {items[active].content}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
