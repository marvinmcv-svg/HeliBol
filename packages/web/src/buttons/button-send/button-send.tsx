"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Send button: the paper plane takes off along an arc, then a check lands. */
export function ButtonSend({ onSend, label = "Send", sentLabel = "Sent", className }: { onSend?: () => void; label?: string; sentLabel?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "flying" | "sent">("idle");
  const send = () => {
    if (state !== "idle") return;
    onSend?.();
    setState("flying");
    setTimeout(() => setState("sent"), 700);
    setTimeout(() => setState("idle"), 2400);
  };
  return (
    <motion.button
      layout
      onClick={send}
      transition={spring.smooth}
      aria-live="polite"
      className={cn("relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full px-5 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-ring", state === "sent" ? "bg-emerald-500" : "bg-sky-600", className)}
    >
      <span className="relative grid size-5 place-items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {state === "sent" ? (
            <motion.svg key="check" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring.bouncy}>
              <motion.path d="M5 12.5l4.5 4.5L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
            </motion.svg>
          ) : (
            <motion.svg
              key="plane"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              animate={state === "flying" ? { x: [0, -4, 60], y: [0, 3, -30], rotate: [0, -10, 25], opacity: [1, 1, 0] } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.7, times: [0, 0.25, 1], ease: "easeIn" }}
            >
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={state === "sent" ? "s" : "l"} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
          {state === "sent" ? sentLabel : label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
