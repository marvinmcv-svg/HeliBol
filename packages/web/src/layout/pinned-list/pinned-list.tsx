"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Pin, PinOff } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface PinnedListItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export interface PinnedListProps {
  items: PinnedListItem[];
  defaultPinned?: string[];
  className?: string;
}

/**
 * A list where pinning an item flies it up into the "Pinned" section (shared layout), and the rest
 * close the gap. Section headers appear and disappear with the section.
 */
export function PinnedList({ items, defaultPinned = [], className }: PinnedListProps) {
  const reduced = useReducedMotion();
  const [pinned, setPinned] = useState<string[]>(defaultPinned);
  const toggle = (id: string) => setPinned((p) => (p.includes(id) ? p.filter((x) => x !== id) : [id, ...p]));
  const pinnedItems = pinned.map((id) => items.find((i) => i.id === id)!).filter(Boolean);
  const rest = items.filter((i) => !pinned.includes(i.id));
  const t = reduced ? { duration: 0 } : spring.smooth;

  const row = (it: PinnedListItem, isPinned: boolean) => (
    <motion.li key={it.id} layout="position" layoutId={it.id} transition={t} className="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-base group-hover:bg-background">{it.icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{it.title}</span>
        {it.subtitle && <span className="block truncate text-xs text-muted-foreground">{it.subtitle}</span>}
      </span>
      <motion.button
        type="button"
        onClick={() => toggle(it.id)}
        aria-pressed={isPinned}
        aria-label={isPinned ? `Unpin ${it.title}` : `Pin ${it.title}`}
        whileTap={reduced ? undefined : { scale: 0.8, rotate: -20 }}
        className={cn("grid size-8 place-items-center rounded-lg transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", isPinned ? "text-primary" : "opacity-0 group-hover:opacity-100 text-muted-foreground")}
      >
        {isPinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
      </motion.button>
    </motion.li>
  );

  return (
    <LayoutGroup>
      <div className={cn("w-full max-w-sm", className)}>
        <AnimatePresence initial={false}>
          {pinnedItems.length > 0 && (
            <motion.p key="ph" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Pinned
            </motion.p>
          )}
        </AnimatePresence>
        <ul>{pinnedItems.map((it) => row(it, true))}</ul>
        <motion.p layout="position" transition={t} className="px-2 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">All</motion.p>
        <ul>{rest.map((it) => row(it, false))}</ul>
      </div>
    </LayoutGroup>
  );
}
