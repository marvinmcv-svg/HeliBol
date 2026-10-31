"use client";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Breadcrumbs where new segments slide in from the right and removed ones collapse away; middle crumbs collapse to "…" when long. */
export function NavBreadcrumb({ path, onNavigate, max = 4, className }: { path: string[]; onNavigate?: (i: number) => void; max?: number; className?: string }) {
  const shown = path.length > max ? [path[0], "…", ...path.slice(-(max - 2))] : path;
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex items-center gap-1">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((p, i) => {
            const last = i === shown.length - 1;
            const real = p === "…" ? -1 : path.lastIndexOf(p);
            return (
              <motion.li key={`${p}-${real}`} layout initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6, width: 0 }} transition={spring.smooth} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden />}
                {last ? <span aria-current="page" className="rounded-md bg-accent px-2 py-0.5 font-medium">{p}</span> : p === "…" ? <span className="px-1 text-muted-foreground">…</span> : <button onClick={() => onNavigate?.(real)} className="rounded-md px-2 py-0.5 text-muted-foreground hover:bg-accent hover:text-foreground">{p}</button>}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </nav>
  );
}
