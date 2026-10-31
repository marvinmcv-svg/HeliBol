"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** macOS app window that zooms open from its dock icon and minimizes back with the genie-ish scale. */
export function MockupWindow({ title, icon, children, className }: { title: string; icon: ReactNode; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={cn("relative flex h-full w-full flex-col items-center justify-end", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.2, y: 160 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.15, y: 200, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }}
            transition={spring.smooth}
            className="mb-4 w-full max-w-md origin-bottom overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-3 py-2">
              <button onClick={() => setOpen(false)} aria-label="Close window" className="size-3 rounded-full bg-[#ff5f57]" />
              <button onClick={() => setOpen(false)} aria-label="Minimize window" className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="mx-auto text-xs font-medium text-muted-foreground">{title}</span>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen((o) => !o)} aria-label={`${open ? "Minimize" : "Open"} ${title}`} className="relative grid size-12 place-items-center rounded-xl bg-gradient-to-b from-zinc-100 to-zinc-300 text-xl shadow-md dark:from-zinc-700 dark:to-zinc-800">
        {icon}
        {open && <span className="absolute -bottom-1.5 size-1 rounded-full bg-foreground" />}
      </button>
    </div>
  );
}
