"use client";
import { Fragment, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { Minus } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useInView, useReducedMotion } from "@kinetik/core";

export interface ComparisonPlan {
  id: string;
  name: string;
  price: string;
  highlight?: boolean;
}

export interface ComparisonRow {
  group?: string;
  feature: string;
  /** Per plan id: true/false or a short text value. */
  values: Record<string, boolean | string>;
}

export interface ComparisonTableProps {
  plans: ComparisonPlan[];
  rows: ComparisonRow[];
  caption?: string;
  className?: string;
}

/**
 * Plan comparison table: a highlight column glides to whichever plan you hover or focus (defaults to
 * the recommended plan), checkmarks draw in row by row when the table scrolls into view, and the
 * header stays sticky. A real <table> with row/column headers.
 */
export function ComparisonTable({ plans, rows, caption = "Compare plans", className }: ComparisonTableProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.2 });
  const featured = plans.findIndex((p) => p.highlight);
  const [col, setCol] = useState(Math.max(0, featured));

  return (
    <div ref={ref} className={cn("relative overflow-x-auto rounded-2xl border border-border", className)} onPointerLeave={() => setCol(Math.max(0, featured))}>
      <table className="w-full min-w-[32rem] table-fixed border-collapse text-sm">
        <colgroup><col className="w-[34%]" />{plans.map((p) => <col key={p.id} />)}</colgroup>
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 z-10 bg-background/90 backdrop-blur">
          <tr>
            <th scope="col" className="p-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Features</th>
            {plans.map((p, i) => (
              <th key={p.id} scope="col" className="relative p-4 text-left" onPointerEnter={() => setCol(i)}>
                {col === i && <motion.span layoutId={`${id}-col`} transition={reduced ? { duration: 0 } : spring.smooth} className="absolute inset-x-1 top-1 bottom-0 rounded-t-xl bg-primary/8 ring-1 ring-primary/30" />}
                <button type="button" onFocus={() => setCol(i)} className="relative block text-left outline-none focus-visible:underline">
                  <span className="block font-semibold">{p.name}{p.highlight && <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 align-middle text-[10px] font-semibold text-primary-foreground">Popular</span>}</span>
                  <span className="text-xs font-normal text-muted-foreground">{p.price}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <Fragment key={r.feature}>
              {r.group && (
                <tr className="border-t border-border bg-muted/40">
                  <th scope="colgroup" colSpan={plans.length + 1} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.group}</th>
                </tr>
              )}
              <tr className="border-t border-border">
                <th scope="row" className="p-4 text-left font-normal text-muted-foreground">{r.feature}</th>
                {plans.map((p, i) => {
                  const v = r.values[p.id];
                  return (
                    <td key={p.id} className={cn("relative p-4", col === i && "bg-primary/5")} onPointerEnter={() => setCol(i)}>
                      {typeof v === "string" ? (
                        <span className="font-medium">{v}</span>
                      ) : v ? (
                        <svg viewBox="0 0 20 20" className="size-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Included">
                          <motion.path d="M4.5 10.5l3.5 3.5 7.5-8" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: seen || reduced ? 1 : 0 }} transition={{ duration: 0.35, delay: reduced ? 0 : ri * 0.04 + i * 0.05 }} />
                        </svg>
                      ) : (
                        <Minus className="size-4 text-muted-foreground/50" aria-label="Not included" />
                      )}
                    </td>
                  );
                })}
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
