"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface Notice {
  icon: ReactNode;
  title: string;
  body: string;
  time: string;
  color: string;
}

/** Notification feed where new items drop in at the top on a loop, pushing the rest down (animated list). */
export function WidgetNotifications({ items, interval = 1800, max = 4, className }: { items: Notice[]; interval?: number; max?: number; className?: string }) {
  const [list, setList] = useState<(Notice & { k: number })[]>([]);
  useEffect(() => {
    let n = 0;
    const push = () => setList((l) => [{ ...items[n % items.length], k: n++ }, ...l].slice(0, max));
    push();
    const t = setInterval(push, interval);
    return () => clearInterval(t);
  }, [items, interval, max]);
  return (
    <ul className={cn("w-80 space-y-2", className)} aria-live="polite">
      <AnimatePresence initial={false}>
        {list.map((n) => (
          <motion.li key={n.k} layout initial={{ opacity: 0, y: -24, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={spring.smooth} className="flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-3 shadow-sm backdrop-blur">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl text-lg" style={{ background: n.color }}>{n.icon}</span>
            <div className="min-w-0 flex-1"><p className="flex items-center gap-1.5 text-sm font-medium">{n.title}<span className="text-xs font-normal text-muted-foreground">· {n.time}</span></p><p className="truncate text-xs text-muted-foreground">{n.body}</p></div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
