"use client";
import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { durationS, easeBezier, spring } from "@kinetik/tokens";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionSmoothProps {
  items: AccordionItem[];
  /** Allow several panels open at once. */
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

export function AccordionSmooth({ items, multiple = false, defaultOpen = [], className }: AccordionSmoothProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const base = useId();
  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : multiple ? [...o, id] : [id]));

  return (
    <div className={cn("divide-y divide-border rounded-2xl border border-border bg-card", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id}>
            <h3>
              <button
                id={`${base}-h-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-p-${item.id}`}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium outline-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                {item.title}
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={spring.snappy} className="grid size-6 shrink-0 place-items-center rounded-full border border-border text-muted-foreground">
                  <svg viewBox="0 0 12 12" className="size-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 2v8M2 6h8" /></svg>
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${base}-p-${item.id}`}
                  role="region"
                  aria-labelledby={`${base}-h-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1, transition: { height: { duration: durationS.moderate, ease: easeBezier.expoOut }, opacity: { duration: durationS.base, delay: 0.05 } } }}
                  exit={{ height: 0, opacity: 0, transition: { height: { duration: durationS.base, ease: easeBezier.standard }, opacity: { duration: durationS.fast } } }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
