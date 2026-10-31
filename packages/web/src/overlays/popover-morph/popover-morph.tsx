"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** A button that morphs (shared layout) into a panel — feedback forms, quick-add, share sheets. */
export function PopoverMorph({ label, title, children, className }: { label: ReactNode; title: string; children: (close: () => void) => ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const out = (e: PointerEvent) => !panel.current?.contains(e.target as Node) && setOpen(false);
    addEventListener("keydown", k);
    addEventListener("pointerdown", out);
    return () => (removeEventListener("keydown", k), removeEventListener("pointerdown", out));
  }, [open]);
  return (
    <div className={cn("relative grid place-items-center", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {open ? (
          <motion.div key="panel" ref={panel} layoutId={id} role="dialog" aria-label={title} transition={spring.smooth} className="w-80 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl" style={{ borderRadius: 16 }}>
            <motion.p layoutId={`${id}-t`} className="px-4 pt-3 text-sm font-medium">{title}</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.12 } }} exit={{ opacity: 0, transition: { duration: 0.05 } }} className="p-4 pt-2">{children(() => setOpen(false))}</motion.div>
          </motion.div>
        ) : (
          <motion.button key="btn" layoutId={id} onClick={() => setOpen(true)} transition={spring.smooth} className="flex h-10 items-center rounded-full border border-border bg-card px-4 text-sm font-medium shadow-sm" style={{ borderRadius: 999 }}>
            <motion.span layoutId={`${id}-t`}>{label}</motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
