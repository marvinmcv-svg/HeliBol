"use client";
import { cloneElement, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";

export interface TooltipAnimatedProps {
  content: ReactNode;
  children: ReactElement<Record<string, unknown>>;
  side?: "top" | "bottom";
  delay?: number;
  className?: string;
}

export function TooltipAnimated({ content, children, side = "top", delay = 300, className }: TooltipAnimatedProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = () => {
    t.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(t.current);
    setOpen(false);
  };
  const dy = side === "top" ? 6 : -6;
  return (
    <span className="relative inline-flex" onPointerEnter={show} onPointerLeave={hide} onFocus={() => setOpen(true)} onBlur={hide} onKeyDown={(e) => e.key === "Escape" && hide()}>
      {cloneElement(children, { "aria-describedby": open ? id : undefined })}
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.85, y: dy }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: dy / 2, transition: { duration: 0.1 } }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-lg",
              side === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top",
              className,
            )}
          >
            {content}
            <span className={cn("absolute left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground", side === "top" ? "-bottom-1" : "-top-1")} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
