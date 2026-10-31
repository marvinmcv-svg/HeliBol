"use client";
import { motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Suggested-prompt chips that cascade in and lift on hover; clicking one hands its text to your composer. */
export function AiSuggestions({ items, onPick, className }: { items: { icon?: string; label: string }[]; onPick?: (label: string) => void; className?: string }) {
  return (
    <motion.ul className={cn("flex flex-wrap justify-center gap-2", className)} initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.06 } } }}>
      {items.map((it) => (
        <motion.li key={it.label} variants={{ h: { opacity: 0, y: 10, filter: "blur(4px)" }, s: { opacity: 1, y: 0, filter: "blur(0px)", transition: spring.smooth } }}>
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => onPick?.(it.label)} className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm shadow-sm transition-colors hover:bg-accent">
            {it.icon && <span>{it.icon}</span>}
            {it.label}
          </motion.button>
        </motion.li>
      ))}
    </motion.ul>
  );
}
