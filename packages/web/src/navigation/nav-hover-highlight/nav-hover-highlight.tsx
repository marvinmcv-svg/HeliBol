"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** A soft highlight that glides between items under the pointer (or keyboard focus) and fades out when you leave the group. */
export function NavHoverHighlight({ items, className }: { items: { label: string; href: string }[]; className?: string }) {
  const [hot, setHot] = useState<number | null>(null);
  const id = useId();
  return (
    <nav className={cn("flex", className)} onPointerLeave={() => setHot(null)}>
      {items.map((it, i) => (
        <a key={it.href} href={it.href} onPointerEnter={() => setHot(i)} onFocus={() => setHot(i)} onBlur={() => setHot(null)} className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground">
          <AnimatePresence>
            {hot === i && <motion.span layoutId={id} className="absolute inset-0 rounded-full bg-accent" transition={spring.snappy} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
          </AnimatePresence>
          <span className="relative">{it.label}</span>
        </a>
      ))}
    </nav>
  );
}
