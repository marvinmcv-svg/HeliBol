"use client";
import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface PaginationAnimatedProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  /** Pages shown either side of the current one. */
  siblings?: number;
  className?: string;
}

function range(page: number, total: number, siblings: number): (number | "…")[] {
  const out: (number | "…")[] = [];
  const lo = Math.max(2, page - siblings), hi = Math.min(total - 1, page + siblings);
  out.push(1);
  if (lo > 2) out.push("…");
  for (let i = lo; i <= hi; i++) out.push(i);
  if (hi < total - 1) out.push("…");
  if (total > 1) out.push(total);
  return out;
}

/**
 * Pagination where the active pill slides between page numbers (shared layout), numbers shuffle in
 * and out as the window moves, and the arrows nudge in their direction on press.
 */
export function PaginationAnimated({ page, total, onChange, siblings = 1, className }: PaginationAnimatedProps) {
  const reduced = useReducedMotion();
  const group = useId();
  const items = range(page, total, siblings);
  const t = reduced ? { duration: 0 } : spring.snappy;
  const arrow = (d: -1 | 1) => (
    <motion.button
      type="button"
      aria-label={d < 0 ? "Previous page" : "Next page"}
      disabled={d < 0 ? page <= 1 : page >= total}
      onClick={() => onChange(page + d)}
      whileTap={reduced ? undefined : { x: d * 3, scale: 0.9 }}
      className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {d < 0 ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
    </motion.button>
  );
  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      {arrow(-1)}
      <ul className="flex items-center gap-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((p, i) => (
            <motion.li
              key={p === "…" ? `gap-${i}` : p}
              layout={reduced ? false : "position"}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={t}
            >
              {p === "…" ? (
                <span className="grid size-9 place-items-center text-muted-foreground" aria-hidden>…</span>
              ) : (
                <button
                  type="button"
                  onClick={() => onChange(p)}
                  aria-current={p === page ? "page" : undefined}
                  aria-label={`Page ${p}`}
                  className={cn("relative grid size-9 place-items-center rounded-lg text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", p === page ? "text-primary-foreground" : "hover:bg-muted")}
                >
                  {p === page && <motion.span layoutId={`${group}-pill`} transition={reduced ? { duration: 0 } : spring.smooth} className="absolute inset-0 rounded-lg bg-primary" />}
                  <span className="relative">{p}</span>
                </button>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {arrow(1)}
    </nav>
  );
}
