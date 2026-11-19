"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ImageAccordionItem {
  image: string;
  title: string;
  kicker?: string;
  body?: string;
}

export interface ImageAccordionProps {
  items: ImageAccordionItem[];
  defaultIndex?: number;
  className?: string;
}

/**
 * Interactive image accordion: tall panels where the active one expands (flex-grow spring) to show
 * its photo and story while the others collapse to slim strips with vertical titles. Hover, focus
 * or tap to switch; arrow keys move between panels. Stacks vertically on narrow screens.
 */
export function ImageAccordion({ items, defaultIndex = 0, className }: ImageAccordionProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [active, setActive] = useState(defaultIndex);
  const t = reduced ? { duration: 0 } : spring.smooth;
  return (
    <div role="tablist" aria-orientation="horizontal" className={cn("flex h-full flex-col gap-2 sm:flex-row", className)}>
      {items.map((it, i) => {
        const on = i === active;
        return (
          <motion.button
            key={it.title}
            id={`${id}-t${i}`}
            role="tab"
            type="button"
            aria-selected={on}
            aria-controls={`${id}-p${i}`}
            tabIndex={on ? 0 : -1}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
              if (!d) return;
              e.preventDefault();
              const n = (i + d + items.length) % items.length;
              setActive(n);
              (document.getElementById(`${id}-t${n}`) as HTMLElement | null)?.focus();
            }}
            animate={{ flexGrow: on ? 5 : 1 }}
            transition={t}
            className="relative min-h-16 min-w-0 basis-0 overflow-hidden rounded-3xl text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-h-0 sm:min-w-16"
          >
            <motion.img src={it.image} alt="" className="absolute inset-0 size-full object-cover" animate={{ scale: on ? 1 : 1.25, filter: on ? "saturate(1)" : "saturate(.4) brightness(.7)" }} transition={reduced ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
            <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <AnimatePresence initial={false}>
              {!on && (
                <motion.span key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-sm font-semibold [writing-mode:vertical-rl] rotate-180 sm:block">
                  {it.title}
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  key="c"
                  id={`${id}-p${i}`}
                  role="tabpanel"
                  aria-labelledby={`${id}-t${i}`}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, transition: { ...t, delay: reduced ? 0 : 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="absolute inset-x-0 bottom-0 p-6"
                >
                  {it.kicker && <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">{it.kicker}</p>}
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{it.title}</p>
                  {it.body && <p className="mt-1 max-w-sm text-sm text-white/75">{it.body}</p>}
                </motion.div>
              )}
            </AnimatePresence>
            {!on && <span className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold sm:hidden">{it.title}</span>}
          </motion.button>
        );
      })}
    </div>
  );
}
