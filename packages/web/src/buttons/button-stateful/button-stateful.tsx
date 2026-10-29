"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@kinetik/core";
import { durationS, spring } from "@kinetik/tokens";

type Status = "idle" | "loading" | "success" | "error";

export interface ButtonStatefulProps {
  children: ReactNode;
  /** Async action. Resolve → success, reject → error. */
  onAction: () => Promise<unknown>;
  successLabel?: string;
  errorLabel?: string;
  /** ms to show success/error before returning to idle */
  resetAfter?: number;
  className?: string;
}

export function ButtonStateful({ children, onAction, successLabel = "Done", errorLabel = "Try again", resetAfter = 1800, className }: ButtonStatefulProps) {
  const [status, setStatus] = useState<Status>("idle");

  const run = async () => {
    if (status !== "idle") return;
    setStatus("loading");
    try {
      await onAction();
      setStatus("success");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), resetAfter);
  };

  const content = {
    idle: <span>{children}</span>,
    loading: <Loader2 className="size-4 animate-spin" aria-label="Loading" />,
    success: <span className="flex items-center gap-1.5"><Check className="size-4" />{successLabel}</span>,
    error: <span className="flex items-center gap-1.5"><X className="size-4" />{errorLabel}</span>,
  }[status];

  return (
    <motion.button
      layout
      onClick={run}
      aria-busy={status === "loading"}
      aria-live="polite"
      transition={spring.smooth}
      animate={status === "error" ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      className={cn(
        "relative inline-flex h-11 min-w-11 items-center justify-center overflow-hidden rounded-full px-5 text-sm font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        status === "success" ? "bg-emerald-500 text-white" : status === "error" ? "bg-destructive text-white" : "bg-primary text-primary-foreground",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status}
          className="flex items-center"
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{ duration: durationS.base }}
        >
          {content}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
