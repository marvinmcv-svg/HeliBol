"use client";
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface DataTableColumn<T> {
  key: keyof T & string;
  header: string;
  /** Custom cell renderer. */
  render?: (row: T) => ReactNode;
  align?: "left" | "right";
  sortable?: boolean;
}

export interface DataTableProps<T extends { id: string }> {
  rows: T[];
  columns: DataTableColumn<T>[];
  /** Columns searched by the filter box. */
  searchKeys?: (keyof T & string)[];
  caption?: string;
  className?: string;
}

/**
 * A sortable, filterable, selectable table where rows glide to their new order (layout animation),
 * filtered rows collapse out, the sort arrow flips, and a bulk-action bar slides up on selection.
 */
export function DataTable<T extends { id: string }>({ rows, columns, searchKeys, caption, className }: DataTableProps<T>) {
  const reduced = useReducedMotion();
  const [sort, setSort] = useState<{ key: keyof T & string; dir: 1 | -1 } | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const view = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = q ? rows.filter((r) => (searchKeys ?? columns.map((c) => c.key)).some((k) => String(r[k]).toLowerCase().includes(q))) : rows;
    if (sort) out = [...out].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0) * sort.dir);
    return out;
  }, [rows, query, sort, searchKeys, columns]);

  const toggleSort = (key: keyof T & string) => setSort((s) => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }));
  const allOn = view.length > 0 && view.every((r) => selected.has(r.id));
  const toggleAll = () => setSelected(allOn ? new Set() : new Set(view.map((r) => r.id)));
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const t = reduced ? { duration: 0 } : spring.smooth;

  return (
    <div className={cn("relative flex h-full flex-col gap-3", className)}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter…"
        aria-label="Filter rows"
        className="h-9 w-56 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <input type="checkbox" checked={allOn} onChange={toggleAll} aria-label="Select all rows" className="size-4 accent-[var(--color-primary,currentColor)]" />
              </th>
              {columns.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <th key={c.key} scope="col" aria-sort={active ? (sort!.dir === 1 ? "ascending" : "descending") : "none"} className={cn("px-3 py-2 font-medium text-muted-foreground", c.align === "right" ? "text-right" : "text-left")}>
                    {c.sortable === false ? c.header : (
                      <button type="button" onClick={() => toggleSort(c.key)} className={cn("inline-flex items-center gap-1 rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", active && "text-foreground")}>
                        {c.header}
                        <motion.span initial={false} animate={{ rotate: active && sort!.dir === -1 ? 180 : 0, opacity: active ? 1 : 0.25 }} transition={t}>
                          <ArrowUp className="size-3.5" />
                        </motion.span>
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {view.map((r) => (
                <motion.tr
                  key={r.id}
                  layout={reduced ? false : "position"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={t}
                  className={cn("border-t border-border transition-colors", selected.has(r.id) ? "bg-primary/5" : "hover:bg-muted/50")}
                >
                  <td className="px-3 py-2"><input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} aria-label={`Select row ${r.id}`} className="size-4" /></td>
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-3 py-2", c.align === "right" && "text-right tabular-nums")}>{c.render ? c.render(r) : String(r[c.key])}</td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {view.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No rows match “{query}”.</p>}
      </div>
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            role="status"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            transition={reduced ? { duration: 0.1 } : spring.bouncy}
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-foreground py-1.5 pl-4 pr-1.5 text-sm text-background shadow-xl"
          >
            {selected.size} selected
            <button type="button" onClick={() => setSelected(new Set())} className="rounded-full bg-background/15 px-3 py-1 hover:bg-background/25">Clear</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
