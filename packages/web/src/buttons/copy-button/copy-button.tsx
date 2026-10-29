"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface CopyButtonProps {
  value: string;
  className?: string;
  /** ms to show the check */
  timeout?: number;
}

export function CopyButton({ value, className, timeout = 1600 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  };
  return (
    <button
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cn("relative grid size-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <span role="status" className="sr-only">{copied ? "Copied" : ""}</span>
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.svg key="check" viewBox="0 0 24 24" className="size-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={spring.bouncy}>
            <motion.path d="M5 12.5l4.5 4.5L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.05 }} />
          </motion.svg>
        ) : (
          <motion.svg key="copy" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={spring.snappy}>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h8" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
