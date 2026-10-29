"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useDragControls, type PanInfo } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface DrawerDraggableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  /** Position inside the nearest positioned ancestor instead of the viewport. */
  contained?: boolean;
  className?: string;
}

export function DrawerDraggable({ open, onOpenChange, title, children, contained = false, className }: DrawerDraggableProps) {
  const controls = useDragControls();
  const panel = useRef<HTMLDivElement>(null);
  const pos = contained ? "absolute" : "fixed";

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onOpenChange]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className={cn(pos, "inset-0 z-40 bg-black/40")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => onOpenChange(false)} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.9 }}
            onDragEnd={onDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring.heavy}
            className={cn(pos, "inset-x-0 bottom-0 z-50 mx-auto max-h-[85%] max-w-lg rounded-t-3xl border border-border bg-card pb-6 shadow-2xl outline-none", className)}
          >
            <div onPointerDown={(e) => controls.start(e)} className="flex cursor-grab touch-none justify-center py-3 active:cursor-grabbing">
              <span className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="px-6">
              <h2 className="text-lg font-semibold">{title}</h2>
              <div className="mt-3">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
