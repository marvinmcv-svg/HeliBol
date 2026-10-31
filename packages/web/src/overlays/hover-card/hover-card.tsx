"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";

/** Rich preview card that springs up from a link after a short hover/focus intent delay (profiles, link previews). */
export function HoverCard({ trigger, children, openDelay = 350, className }: { trigger: ReactNode; children: ReactNode; openDelay?: number; className?: string }) {
  const [open, setOpen] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();
  const show = () => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setOpen(true), openDelay);
  };
  const hide = () => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setOpen(false), 120);
  };
  return (
    <span className={cn("relative inline-block", className)} onPointerEnter={show} onPointerLeave={hide} onFocus={() => setOpen(true)} onBlur={hide}>
      <span aria-describedby={open ? id : undefined}>{trigger}</span>
      <AnimatePresence>
        {open && (
          <motion.span id={id} role="tooltip" onPointerEnter={() => clearTimeout(t.current)} onPointerLeave={hide} initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.98, transition: { duration: 0.12 } }} transition={{ type: "spring", stiffness: 420, damping: 30 }} className="absolute top-full left-1/2 z-40 mt-2 block w-72 -translate-x-1/2 origin-top rounded-2xl border border-border bg-popover p-4 text-left shadow-2xl">
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
