"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDownUp, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@kinetik/core";
import type { ComponentMeta, Engine, PageType } from "@web/types";
import { added, newIds } from "@/lib/registry.generated";
import { categories, engines, pageTypes } from "@/lib/taxonomy";
import { ComponentCard } from "./component-card";

function Chip({ active, onClick, children, count }: { active: boolean; onClick: () => void; children: ReactNode; count?: number }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
      {count !== undefined && <span className={cn("tabular-nums", active ? "text-background/60" : "text-muted-foreground/60")}>{count}</span>}
    </button>
  );
}

export type ItemKind = "component" | "block" | "flow";
export function hrefFor(m: ComponentMeta, kind: ItemKind = "component") {
  return kind === "block" ? `/blocks/${m.id}` : kind === "flow" ? `/flows/${m.id}` : `/components/${m.category}/${m.id}`;
}

type Sort = "featured" | "newest" | "az";
const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "az", label: "A–Z" },
];
const PAGE = 36;
const newSet = new Set(newIds);

/**
 * Gallery browser: search, category / engine / page-type filters with live counts, sorting, and
 * incremental rendering (36 cards at a time, more as you scroll). Every filter is mirrored into
 * the URL so a filtered view can be shared or bookmarked, like 21st.dev and Mobbin.
 */
export function Browse({
  items,
  initialCategory,
  kind = "component",
  kindOf,
  empty,
}: {
  items: ComponentMeta[];
  initialCategory?: string;
  kind?: ItemKind;
  /** For mixed lists (e.g. Saved): the kind of each item. */
  kindOf?: (m: ComponentMeta) => ItemKind;
  empty?: ReactNode;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(initialCategory ?? null);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [page, setPage] = useState<PageType | null>(null);
  const [sort, setSort] = useState<Sort>("featured");
  const [shown, setShown] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const ready = useRef(false);

  // Read deep links once (/components?engine=gsap&sort=newest&q=scroll …).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const e = sp.get("engine");
    if (e && items.some((i) => i.engine === e)) setEngine(e as Engine);
    const p = sp.get("page");
    if (p && items.some((i) => i.pageTypes.includes(p as PageType))) setPage(p as PageType);
    const c = sp.get("cat");
    if (c && !initialCategory && items.some((i) => i.category === c)) setCat(c);
    const s = sp.get("sort");
    if (s === "newest" || s === "az") setSort(s);
    const qq = sp.get("q");
    if (qq) setQ(qq);
    ready.current = true;
  }, [items, initialCategory]);

  // Mirror state into the URL without adding history entries.
  useEffect(() => {
    if (!ready.current) return;
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (cat && !initialCategory) sp.set("cat", cat);
    if (engine) sp.set("engine", engine);
    if (page) sp.set("page", page);
    if (sort !== "featured") sp.set("sort", sort);
    const qs = sp.toString();
    window.history.replaceState(window.history.state, "", qs ? `?${qs}` : window.location.pathname);
    setShown(PAGE);
  }, [q, cat, engine, page, sort, initialCategory]);

  const matches = (m: ComponentMeta, skip?: "cat" | "engine" | "page") => {
    if (skip !== "cat" && cat && m.category !== cat) return false;
    if (skip !== "engine" && engine && m.engine !== engine) return false;
    if (skip !== "page" && page && !m.pageTypes.includes(page)) return false;
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return true;
    const hay = [m.name, m.id, m.description, m.engine, m.category, ...m.tags, ...(m.inspiration ?? [])].join(" ").toLowerCase();
    return terms.every((t) => hay.includes(t));
  };

  const filtered = useMemo(() => {
    const out = items.filter((m) => matches(m));
    if (sort === "newest") out.sort((a, b) => (added[b.id] ?? "").localeCompare(added[a.id] ?? ""));
    if (sort === "az") out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, q, cat, engine, page, sort]);

  // Facet counts: how many results each chip would give with the other filters applied.
  const count = (skip: "cat" | "engine" | "page", pred: (m: ComponentMeta) => boolean) => items.filter((m) => pred(m) && matches(m, skip)).length;
  const usedEngines = Array.from(new Set(items.map((i) => i.engine)));
  const usedPages = Array.from(new Set(items.flatMap((i) => i.pageTypes)));
  const usedCats = categories.filter((c) => items.some((i) => i.category === c.id));
  const activeFacets = (engine ? 1 : 0) + (page ? 1 : 0);
  const anyFilter = q || (cat && !initialCategory) || engine || page;

  // Load more as the sentinel approaches the viewport.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown((s) => s + PAGE), { rootMargin: "800px" });
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const visible = filtered.slice(0, shown);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full min-w-0 sm:w-auto sm:max-w-md sm:flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, tag, engine or use case…"
              aria-label="Search the gallery"
              className="h-10 w-full rounded-xl border border-border bg-card pr-3 pl-9 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <label className="relative inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card pr-2 pl-3 text-sm">
            <ArrowDownUp className="size-3.5 text-muted-foreground" />
            <span className="sr-only">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-full cursor-pointer bg-transparent pr-1 outline-none">
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            aria-controls="browse-facets"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm md:hidden"
          >
            <SlidersHorizontal className="size-3.5" /> Filters
            {activeFacets > 0 && <span className="grid size-5 place-items-center rounded-full bg-foreground text-[10px] text-background">{activeFacets}</span>}
          </button>
        </div>

        {!initialCategory && usedCats.length > 1 && (
          <div className="scrollbar-thin -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
            <Chip active={!cat} onClick={() => setCat(null)} count={count("cat", () => true)}>All</Chip>
            {usedCats.map((c) => {
              const n = count("cat", (m) => m.category === c.id);
              return (
                <Chip key={c.id} active={cat === c.id} onClick={() => setCat(cat === c.id ? null : c.id)} count={n}>
                  {c.name}
                </Chip>
              );
            })}
          </div>
        )}

        <div id="browse-facets" className={cn("flex-wrap items-center gap-x-4 gap-y-2 text-xs md:flex", filtersOpen ? "flex" : "hidden")}>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground">Engine</span>
            {usedEngines.map((e) => (
              <Chip key={e} active={engine === e} onClick={() => setEngine(engine === e ? null : e)} count={count("engine", (m) => m.engine === e)}>
                {engines[e].name}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted-foreground">Page type</span>
            {usedPages.map((p) => (
              <Chip key={p} active={page === p} onClick={() => setPage(page === p ? null : p)} count={count("page", (m) => m.pageTypes.includes(p))}>
                {pageTypes[p]}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground" aria-live="polite">
          <span>
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
            {sort !== "featured" && ` · ${SORTS.find((s) => s.id === sort)!.label.toLowerCase()}`}
          </span>
          {anyFilter && (
            <button
              onClick={() => {
                setQ("");
                setCat(initialCategory ?? null);
                setEngine(null);
                setPage(null);
              }}
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <X className="size-3" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        empty ?? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="font-medium">Nothing matches “{q}”.</p>
            <p className="mt-1 text-sm text-muted-foreground">Try fewer words, another engine, or clear the filters.</p>
          </div>
        )
      ) : (
        <div className={kind === "block" ? "grid grid-cols-1 gap-5 xl:grid-cols-2" : kind === "flow" ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 min-[1800px]:grid-cols-4"}>
          {visible.map((m) => {
            const k = kindOf?.(m) ?? kind;
            return (
              <div key={m.id} className="[animation:k-fadein_.3s_ease_both]">
                <ComponentCard meta={m} href={hrefFor(m, k)} size={k === "block" ? "lg" : k === "flow" ? "phone" : "md"} isNew={newSet.has(m.id)} />
              </div>
            );
          })}
        </div>
      )}
      {shown < filtered.length && (
        <div ref={sentinel} className="flex justify-center pt-2">
          <button onClick={() => setShown((s) => s + PAGE)} className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
            Show more ({filtered.length - shown} left)
          </button>
        </div>
      )}
    </div>
  );
}
