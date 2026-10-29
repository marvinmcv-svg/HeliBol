"use client";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface AutoAnimateListProps<T> {
  items: T[];
  getKey: (item: T) => string;
  render: (item: T) => ReactNode;
  className?: string;
  itemClassName?: string;
}

/** Drop-in list where adds, removals and re-sorts animate automatically. */
export function AutoAnimateList<T>({ items, getKey, render, className, itemClassName }: AutoAnimateListProps<T>) {
  return (
    <ul className={cn("relative", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {items.map((item) => (
          <motion.li
            key={getKey(item)}
            layout
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            transition={spring.smooth}
            className={itemClassName}
          >
            {render(item)}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
