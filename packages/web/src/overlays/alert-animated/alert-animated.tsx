"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertAnimatedProps {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
  /** Auto-dismiss after this many ms (a progress line shows the time left). */
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: ReactNode;
  className?: string;
}

const tones: Record<AlertTone, { ring: string; icon: string; bar: string; path: string }> = {
  info: { ring: "border-sky-500/30 bg-sky-500/5", icon: "text-sky-500", bar: "bg-sky-500", path: "M12 8h.01M11 12h1v5h1" },
  success: { ring: "border-emerald-500/30 bg-emerald-500/5", icon: "text-emerald-500", bar: "bg-emerald-500", path: "M8 12.5l2.8 2.8L16.5 9" },
  warning: { ring: "border-amber-500/30 bg-amber-500/5", icon: "text-amber-500", bar: "bg-amber-500", path: "M12 7.5v5.5M12 16.5h.01" },
  danger: { ring: "border-rose-500/30 bg-rose-500/5", icon: "text-rose-500", bar: "bg-rose-500", path: "M9 9l6 6M15 9l-6 6" },
};

/**
 * Inline alert that enters with a spring, draws its icon stroke, and on dismiss collapses its own
 * height so the content below closes the gap smoothly. Optional auto-dismiss with a progress line.
 */
export function AlertAnimated({ tone = "info", title, children, duration, dismissible = true, onDismiss, action, className }: AlertAnimatedProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(true);
  const t = tones[tone];
  const close = () => setOpen(false);

  useEffect(() => {
    if (!duration) return;
    const id = setTimeout(close, duration);
    return () => clearTimeout(id);
  }, [duration]);

  return (
    <AnimatePresence initial={!reduced} onExitComplete={onDismiss}>
      {open && (
        <motion.div
          role={tone === "danger" || tone === "warning" ? "alert" : "status"}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1, height: "auto" }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0, marginTop: 0, marginBottom: 0, scale: 0.98 }}
          transition={reduced ? { duration: 0.15 } : spring.smooth}
          className={cn("relative overflow-hidden rounded-2xl border", t.ring, className)}
        >
          <div className="flex gap-3 p-4">
            <svg viewBox="0 0 24 24" className={cn("mt-0.5 size-5 shrink-0", t.icon)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <motion.circle cx="12" cy="12" r="9.5" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} />
              <motion.path d={t.path} initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }} />
            </svg>
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-semibold">{title}</p>
              {children && <div className="mt-1 text-muted-foreground">{children}</div>}
              {action && <div className="mt-3">{action}</div>}
            </div>
            {dismissible && (
              <button type="button" onClick={close} aria-label="Dismiss" className="grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                <X className="size-4" />
              </button>
            )}
          </div>
          {duration && !reduced && (
            <motion.span aria-hidden className={cn("absolute bottom-0 left-0 h-0.5 w-full origin-left", t.bar)} initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: duration / 1000, ease: "linear" }} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
