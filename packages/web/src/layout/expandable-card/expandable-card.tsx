"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface ExpandableItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  content: ReactNode;
}

export function ExpandableCards({ items, className }: { items: ExpandableItem[]; className?: string }) {
  const [active, setActive] = useState<ExpandableItem | null>(null);
  const uid = useId();
  const dialog = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    dialog.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const lid = (part: string, id: string) => `${uid}-${part}-${id}`;

  return (
    <>
      <AnimatePresence>
        {active && <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)} />}
      </AnimatePresence>
      <AnimatePresence onExitComplete={() => lastTrigger.current?.focus()}>
        {active && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.div
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby={lid("t", active.id)}
              tabIndex={-1}
              layoutId={lid("card", active.id)}
              transition={spring.smooth}
              className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-card shadow-2xl outline-none"
            >
              <motion.img layoutId={lid("img", active.id)} transition={spring.smooth} src={active.image} alt="" className="aspect-[16/10] w-full object-cover" />
              <div className="flex items-start justify-between gap-4 p-5">
                <div>
                  <motion.h3 layoutId={lid("t", active.id)} id={lid("t", active.id)} className="text-lg font-semibold">{active.title}</motion.h3>
                  <motion.p layoutId={lid("s", active.id)} className="text-sm text-muted-foreground">{active.subtitle}</motion.p>
                </div>
                <button onClick={() => setActive(null)} aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-full bg-muted hover:bg-accent">
                  <X className="size-4" />
                </button>
              </div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="overflow-auto px-5 pb-6 text-sm leading-relaxed text-muted-foreground">
                {active.content}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ul className={cn("grid gap-3", className)}>
        {items.map((item) => (
          <motion.li key={item.id} layoutId={lid("card", item.id)} transition={spring.smooth} className="overflow-hidden rounded-2xl bg-card ring-1 ring-border">
            <button
              onClick={(e) => {
                lastTrigger.current = e.currentTarget;
                setActive(item);
              }}
              className="flex w-full items-center gap-3 p-2 pr-4 text-left outline-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <motion.img layoutId={lid("img", item.id)} transition={spring.smooth} src={item.image} alt="" className="size-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <motion.h3 layoutId={lid("t", item.id)} className="truncate text-sm font-semibold">{item.title}</motion.h3>
                <motion.p layoutId={lid("s", item.id)} className="truncate text-xs text-muted-foreground">{item.subtitle}</motion.p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">Open</span>
            </button>
          </motion.li>
        ))}
      </ul>
    </>
  );
}
