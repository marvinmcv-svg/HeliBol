"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Sparkles, Terminal } from "lucide-react";

const icons = { copy: Copy, sparkles: Sparkles, terminal: Terminal };
import { cn } from "@kinetik/core";

export function CopyButton({ text, label, className, icon = "copy" }: { text: string; label?: string; className?: string; icon?: keyof typeof icons }) {
  const Icon = icons[icon];
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
      className={cn("inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", className)}
      aria-label={label ?? "Copy"}
    >
      <span className="relative grid size-3.5 place-items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={done ? "y" : "n"} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
            {done ? <Check className="size-3.5 text-emerald-500" /> : <Icon className="size-3.5" />}
          </motion.span>
        </AnimatePresence>
      </span>
      {label && <span>{done ? "Copied!" : label}</span>}
    </button>
  );
}
