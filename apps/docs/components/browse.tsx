"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";
import type { ComponentMeta, Engine, PageType } from "@web/types";
import { categories, engines, pageTypes } from "@/lib/taxonomy";
import { ComponentCard } from "./component-card";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function hrefFor(m: ComponentMeta, kind: "component" | "block" | "flow" = "component") {
  return kind === "block" ? `/blocks/${m.id}` : kind === "flow" ? `/flows/${m.id}` : `/components/${m.category}/${m.id}`;
}

export function Browse({ items, initialCategory, kind = "component" }: { items: ComponentMeta[]; initialCategory?: string; kind?: "component" | "block" | "flow" }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(initialCategory ?? null);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [page, setPage] = useState<PageType | null>(null);

  const usedEngines = Array.from(new Set(items.map((i) => i.engine)));
  const usedPages = Array.from(new Set(items.flatMap((i) => i.pageTypes)));
  const usedCats = categories.filter((c) => items.some((i) => i.category === c.id));

  const filtered = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((m) => {
      if (cat && m.category !== cat) return false;
      if (engine && m.engine !== engine) return false;
      if (page && !m.pageTypes.includes(page)) return false;
      const hay = [m.name, m.id, m.description, ...m.tags].join(" ").toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [items, q, cat, engine, page]);

  const anyFilter = q || cat || engine || page;

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by name, tag or use case…"
            className="h-10 w-full rounded-xl border border-border bg-card pr-3 pl-9 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>
        {!initialCategory && usedCats.length > 1 && (
          <div className="scrollbar-thin flex gap-1.5 overflow-x-auto pb-1">
            <Chip active={!cat} onClick={() => setCat(null)}>All</Chip>
            {usedCats.map((c) => (
              <Chip key={c.id} active={cat === c.id} onClick={() => setCat(cat === c.id ? null : c.id)}>{c.name}</Chip>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground">Engine</span>
            {usedEngines.map((e) => (
              <Chip key={e} active={engine === e} onClick={() => setEngine(engine === e ? null : e)}>{engines[e].name}</Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground">Page type</span>
            {usedPages.map((p) => (
              <Chip key={p} active={page === p} onClick={() => setPage(page === p ? null : p)}>{pageTypes[p]}</Chip>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
          {anyFilter && (
            <button onClick={() => { setQ(""); setCat(initialCategory ?? null); setEngine(null); setPage(null); }} className="inline-flex items-center gap-1 hover:text-foreground">
              <X className="size-3" /> Clear filters
            </button>
          )}
        </div>
      </div>
      <motion.div layout className={kind === "block" ? "grid grid-cols-1 gap-5 xl:grid-cols-2" : kind === "flow" ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" : "grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3"}>
        <AnimatePresence mode="popLayout">
          {filtered.map((m) => (
            <motion.div key={m.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={spring.smooth}>
              <ComponentCard meta={m} href={hrefFor(m, kind)} size={kind === "block" ? "lg" : kind === "flow" ? "phone" : "md"} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
