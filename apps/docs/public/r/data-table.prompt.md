You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Animated Data Table (`data-table`)

Sortable, filterable, selectable table: rows glide to their new order, filtered rows fade out, the sort arrow flips and a bulk-action bar springs up on selection.

## What it should do
Build an animated data table with Motion: a semantic table whose tbody rows are motion.tr with layout="position" inside AnimatePresence. Header buttons cycle sort asc → desc → none (aria-sort) with a rotating arrow. A filter input narrows rows. Row checkboxes + select-all; when any are selected, a pill bar springs up from the bottom with the count and Clear.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/data-table.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Non-negotiables
- **Accessibility:** Real <table> with caption, scope=col and aria-sort; checkboxes labelled per row; bulk bar is role=status. Reduced motion: no row movement.
- **Performance:** layout="position" on rows only (no size animation); memoised filtering/sorting.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/data-table.tsx
```tsx
"use client";
import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { spring } from "@/lib/kinetik/tokens";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

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
```

## Usage example
```tsx
"use client";
import { DataTable } from "@/components/kinetik/data-table";

type Row = { id: string; customer: string; plan: string; status: string; mrr: number };
const rows: Row[] = [
  { id: "1", customer: "Northwind", plan: "Scale", status: "Active", mrr: 1240 },
  { id: "2", customer: "Acme Corp", plan: "Pro", status: "Trial", mrr: 0 },
  { id: "3", customer: "Globex", plan: "Scale", status: "Active", mrr: 980 },
  { id: "4", customer: "Initech", plan: "Starter", status: "Past due", mrr: 49 },
  { id: "5", customer: "Umbrella", plan: "Enterprise", status: "Active", mrr: 4200 },
  { id: "6", customer: "Hooli", plan: "Pro", status: "Active", mrr: 320 },
  { id: "7", customer: "Stark Labs", plan: "Starter", status: "Canceled", mrr: 0 },
];
const tone: Record<string, string> = { Active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", Trial: "bg-sky-500/15 text-sky-600 dark:text-sky-300", "Past due": "bg-amber-500/15 text-amber-700 dark:text-amber-300", Canceled: "bg-zinc-500/15 text-muted-foreground" };

export default function Demo() {
  return (
    <div className="h-full p-5">
      <DataTable<Row>
        caption="Customers"
        rows={rows}
        searchKeys={["customer", "plan", "status"]}
        columns={[
          { key: "customer", header: "Customer" },
          { key: "plan", header: "Plan" },
          { key: "status", header: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone[r.status]}`}>{r.status}</span> },
          { key: "mrr", header: "MRR", align: "right", render: (r) => `$${r.mrr.toLocaleString()}` },
        ]}
      />
    </div>
  );
}
```

## lib/kinetik/utils.ts
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Server-safe class merger (same as shadcn's `cn`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## lib/kinetik/core.ts
```ts
"use client";
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

export { cn } from "./utils";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const ATTR = "data-reduce-motion";

function subscribeReduced(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener("change", cb);
  // Docs (or an app setting) can force reduced motion with <html data-reduce-motion>.
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: [ATTR] });
  return () => {
    mq.removeEventListener("change", cb);
    mo.disconnect();
  };
}

function getReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCE_QUERY).matches || document.documentElement.hasAttribute(ATTR);
}

/**
 * True when the user prefers reduced motion (OS setting) or the app forced it via
 * `<html data-reduce-motion>`. Components must swap movement for opacity / instant changes.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReduced, getReduced, () => false);
}

/** Non-hook check for imperative code (GSAP timelines, canvas loops). */
export const prefersReducedMotion = getReduced;

/** Becomes true the first time `ref` enters the viewport (or every time when once=false). */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = true, amount = 0.2, rootMargin = "0px", root }: { once?: boolean; amount?: number; rootMargin?: string; root?: RefObject<Element | null> } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold: amount, rootMargin, root: root?.current ?? null },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, amount, rootMargin, root]);
  return inView;
}

/** Coarse-pointer / touch device — pointer effects should switch off. */
export function usePrefersTouch(): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(hover: none), (pointer: coarse)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches,
    () => false,
  );
}

/** False while the tab is hidden — pause loops. */
export function usePageVisible(): boolean {
  return useSyncExternalStore(
    (cb) => {
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => !document.hidden,
    () => true,
  );
}

/** Runs `cb` each animation frame while `active`; cleans up automatically. */
export function useRafLoop(cb: (t: number, dt: number) => void, active = true) {
  const saved = useRef(cb);
  saved.current = cb;
  useEffect(() => {
    if (!active) return;
    let id = 0;
    let last = performance.now();
    const tick = (t: number) => {
      saved.current(t, t - last);
      last = t;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active]);
}

/** Bumping this key remounts children — used by "Replay" in previews. */
export function useReplayKey() {
  const [key, setKey] = useState(0);
  return [key, () => setKey((k) => k + 1)] as const;
}

export interface CanvasFrame {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  /** seconds since start */
  time: number;
  /** seconds since last frame */
  dt: number;
  /** pointer position in CSS px relative to the canvas, or null when outside */
  pointer: { x: number; y: number } | null;
}

/**
 * Canvas animation loop with the boring parts done: DPR-aware sizing (ResizeObserver), pausing while
 * off-screen or in a background tab, pointer tracking, and a single static frame under reduced motion.
 */
export function useCanvas(draw: (f: CanvasFrame) => void, { maxDpr = 2, interactive = true }: { maxDpr?: number; interactive?: boolean } = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const saved = useRef(draw);
  saved.current = draw;
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let visible = true;
    let raf = 0;
    let start = performance.now();
    let last = start;
    let pointer: CanvasFrame["pointer"] = null;
    const frame = (now: number) => {
      saved.current({ ctx, width: w, height: h, time: (now - start) / 1000, dt: Math.min(0.05, (now - last) / 1000), pointer });
      last = now;
    };
    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      if (reduced) {
        frame(performance.now());
        return;
      }
      if (visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) frame(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      play();
    });
    io.observe(canvas);
    const onVis = () => play();
    document.addEventListener("visibilitychange", onVis);
    const host = canvas.parentElement ?? canvas;
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const leave = () => (pointer = null);
    if (interactive) {
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", leave);
    }
    start = performance.now();
    play();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [reduced, maxDpr, interactive]);
  return ref;
}
```

## lib/kinetik/tokens.ts
```ts
/**
 * kinetik motion tokens — the single motion language shared by web (CSS / Motion / GSAP)
 * and native (Reanimated). Import tokens, never inline magic numbers.
 */

/** Durations in milliseconds. */
export const duration = {
  instant: 0,
  micro: 100,
  fast: 150,
  base: 220,
  moderate: 320,
  slow: 480,
  slower: 700,
  cinematic: 1200,
} as const;
export type DurationToken = keyof typeof duration;

/** Durations in seconds (Motion / GSAP use seconds). */
export const durationS = Object.fromEntries(
  Object.entries(duration).map(([k, v]) => [k, v / 1000]),
) as { [K in DurationToken]: number };

type Bezier = readonly [number, number, number, number];

/** Cubic-bezier control points (Motion accepts these arrays directly). */
export const easeBezier = {
  standard: [0.2, 0, 0, 1],
  enter: [0, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1],
  emphasized: [0.2, 0, 0, 1],
  expoOut: [0.16, 1, 0.3, 1],
  backOut: [0.34, 1.56, 0.64, 1],
} as const satisfies Record<string, Bezier>;
export type EaseToken = keyof typeof easeBezier | "springCss" | "linear";

/** Spring-like easing in pure CSS via linear() (stiffness≈260, damping≈30). */
export const springCss =
  "linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017 19.4%, 1.067, 1.099 24.3%, 1.108 26%, 1.100, 1.078 30.1%, 1.002 35.7%, 0.981 38.5%, 0.968 41.5%, 0.965 44.7%, 0.976 51.4%, 1.001 60%, 1.008 66.7%, 1.002 81%, 1)";

/** CSS easing strings. */
export const ease: Record<EaseToken, string> = {
  ...(Object.fromEntries(
    Object.entries(easeBezier).map(([k, v]) => [k, `cubic-bezier(${v.join(", ")})`]),
  ) as Record<keyof typeof easeBezier, string>),
  springCss,
  linear: "linear",
};

/** Matching GSAP ease names. */
export const gsapEase: Record<EaseToken, string> = {
  standard: "power3.out",
  enter: "power2.out",
  exit: "power2.in",
  emphasized: "power4.out",
  expoOut: "expo.out",
  backOut: "back.out(1.7)",
  springCss: "elastic.out(1, 0.6)",
  linear: "none",
};

/** Matching Anime.js v4 ease names. */
export const animeEase: Record<EaseToken, string> = {
  standard: "outCubic",
  enter: "outQuad",
  exit: "inQuad",
  emphasized: "outQuart",
  expoOut: "outExpo",
  backOut: "outBack(1.7)",
  springCss: "outElastic(1, .6)",
  linear: "linear",
};

export type SpringToken = "snappy" | "smooth" | "gentle" | "bouncy" | "heavy";

/** Spring presets — numbers are identical for Motion and Reanimated. */
export const springConfig: Record<SpringToken, { stiffness: number; damping: number; mass: number }> = {
  snappy: { stiffness: 500, damping: 35, mass: 1 },
  smooth: { stiffness: 260, damping: 30, mass: 1 },
  gentle: { stiffness: 120, damping: 20, mass: 1 },
  bouncy: { stiffness: 400, damping: 15, mass: 1 },
  heavy: { stiffness: 200, damping: 40, mass: 1.5 },
};

/** Ready-to-spread Motion transitions: `transition={spring.smooth}`. */
export const spring = Object.fromEntries(
  Object.entries(springConfig).map(([k, v]) => [k, { type: "spring" as const, ...v }]),
) as Record<SpringToken, { type: "spring"; stiffness: number; damping: number; mass: number }>;

/** Motion's perceptual equivalents ({ visualDuration, bounce }). */
export const springVisual: Record<SpringToken, { type: "spring"; visualDuration: number; bounce: number }> = {
  snappy: { type: "spring", visualDuration: 0.18, bounce: 0.05 },
  smooth: { type: "spring", visualDuration: 0.3, bounce: 0.1 },
  gentle: { type: "spring", visualDuration: 0.45, bounce: 0.15 },
  bouncy: { type: "spring", visualDuration: 0.3, bounce: 0.45 },
  heavy: { type: "spring", visualDuration: 0.5, bounce: 0 },
};

/** Reanimated `withSpring` configs (same physics). */
export const reanimatedSpring = springConfig;

export const distance = { xs: 4, sm: 8, md: 16, lg: 32, xl: 64 } as const;
export const stagger = { tight: 0.02, base: 0.05, loose: 0.1 } as const;
export const blur = { in: 8 } as const;
export const press = { scale: 0.97, hoverLift: -2 } as const;

/** CSS custom properties, e.g. for `:root`. */
export function toCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(duration)) vars[`--k-duration-${k}`] = `${v}ms`;
  for (const [k, v] of Object.entries(ease)) vars[`--k-ease-${k}`] = v;
  for (const [k, v] of Object.entries(distance)) vars[`--k-distance-${k}`] = `${v}px`;
  for (const [k, v] of Object.entries(stagger)) vars[`--k-stagger-${k}`] = `${v}s`;
  return vars;
}

export const tokens = { duration, durationS, ease, easeBezier, gsapEase, animeEase, spring, springConfig, springVisual, distance, stagger, blur, press };
export default tokens;
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
