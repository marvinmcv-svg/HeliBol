You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Search & Filter (`flow-search-filter`)

Shop search journey: the search bar takes over the header, recent searches stagger in, a filter sheet with chips and a price cap springs up, and the results grid re-flows with layout animations — with a helpful empty result.

## What it should do
Build a mobile search & filter flow: a "Shop" header whose title collapses (height → 0) when the search field is focused, a Cancel button, recent searches that stagger in, a filter button with a springy count badge, a bottom-sheet filter dialog with category chips (aria-pressed, tap scale) and a max-price range, and a two-column results grid that re-flows with layout animations (AnimatePresence popLayout). Show an empty result with a Clear filters action and announce the result count. Native: Expo + Reanimated layout transitions, @gorhom-style sheet with Gesture Handler, expo-haptics on chip taps.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/flow-search-filter.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Target platform: React Native (Expo)
The source below is the **web prototype** of this flow. Build the real thing natively:
- Expo SDK 55+, Expo Router, React Native New Architecture.
- `react-native-reanimated` 4 (+ `react-native-worklets`) for all animation; `react-native-gesture-handler` for pans/drags; `expo-haptics` wherever the prototype calls `haptic()` (light → ImpactFeedbackStyle.Light, medium → Medium, success/error → NotificationFeedbackType).
- Use these exact spring presets with `withSpring` (same physics as web): snappy {stiffness:500,damping:35}, smooth {260,30}, gentle {120,20}, bouncy {400,15}, heavy {200,40,mass:1.5}.
- Gesture- and scroll-driven values must run on the UI thread (shared values, `useAnimatedStyle`, `useAnimatedScrollHandler`). State-driven transitions can use Reanimated's CSS-style API or layout animations (`entering`/`exiting`/`layout`).
- Respect `useReducedMotion()` / `ReduceMotion.System`: swap movement for fades.
- Screens: Browse → Search → Filters → Results.

## Non-negotiables
- **Accessibility:** Labelled search input, filter button announces active count, chips use aria-pressed, result count is aria-live, the sheet is a labelled dialog. Reduced motion: instant layout changes.
- **Performance:** Filtering is memoised; grid uses popLayout so exits don't block re-flow.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-search-filter.tsx
```tsx
"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { spring } from "@/lib/kinetik/tokens";
import { useReducedMotion } from "@/lib/kinetik/core";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

const products = [
  { id: 1, name: "Trail Runner", cat: "Shoes", price: 129, img: 1 },
  { id: 2, name: "Shell Jacket", cat: "Jackets", price: 189, img: 2 },
  { id: 3, name: "Merino Tee", cat: "Tops", price: 59, img: 3 },
  { id: 4, name: "Road Racer", cat: "Shoes", price: 159, img: 4 },
  { id: 5, name: "Puffer Vest", cat: "Jackets", price: 119, img: 5 },
  { id: 6, name: "Tech Hoodie", cat: "Tops", price: 89, img: 6 },
];
const cats = ["Shoes", "Jackets", "Tops"];

/**
 * Search → filter sheet → results. The search bar expands over the title, recent searches stagger
 * in, the filter sheet springs up with chips and a price cap, and the grid re-flows with layout
 * animations while the result count rolls. An empty result gets a helpful reset.
 */
export function FlowSearchFilter({ initialStep = 0 }: { initialStep?: number }) {
  const reduced = useReducedMotion();
  const [focused, setFocused] = useState(initialStep === 1);
  const [query, setQuery] = useState("");
  const [sheet, setSheet] = useState(initialStep === 2);
  const [picked, setPicked] = useState<string[]>(initialStep >= 3 ? ["Shoes"] : []);
  const [cap, setCap] = useState(200);
  const t = reduced ? { duration: 0 } : spring.smooth;

  const results = useMemo(() => products.filter((p) => (!query || p.name.toLowerCase().includes(query.toLowerCase())) && (!picked.length || picked.includes(p.cat)) && p.price <= cap), [query, picked, cap]);
  const active = picked.length + (cap < 200 ? 1 : 0);

  return (
    <div className="relative flex h-full flex-col bg-zinc-50 pt-12 text-zinc-900">
      <LayoutGroup>
        <div className="px-4">
          <AnimatePresence initial={false}>
            {!focused && <motion.h2 key="t" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={t} className="overflow-hidden text-2xl font-bold">Shop</motion.h2>}
          </AnimatePresence>
          <motion.div layout transition={t} className="mt-2 flex items-center gap-2">
            <label className="flex flex-1 items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-zinc-200 focus-within:ring-2 focus-within:ring-zinc-900">
              <Search className="size-4 text-zinc-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} placeholder="Search products" aria-label="Search products" className="w-full bg-transparent text-sm outline-none" />
            </label>
            {focused ? (
              <button onClick={() => (setFocused(false), setQuery(""))} className="text-sm font-medium">Cancel</button>
            ) : (
              <button onClick={() => (haptic(), setSheet(true))} aria-label={`Filters${active ? `, ${active} active` : ""}`} className="relative grid size-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
                <SlidersHorizontal className="size-4" />
                <AnimatePresence>{active > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring.bouncy} className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-zinc-900 text-[10px] text-white">{active}</motion.span>}</AnimatePresence>
              </button>
            )}
          </motion.div>
        </div>

        {focused && !query ? (
          <motion.ul initial="h" animate="s" variants={{ s: { transition: { staggerChildren: reduced ? 0 : 0.05 } } }} className="mt-4 space-y-1 px-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Recent</p>
            {["running shoes", "rain jacket", "merino"].map((r) => (
              <motion.li key={r} variants={{ h: { opacity: 0, x: reduced ? 0 : -10 }, s: { opacity: 1, x: 0 } }}>
                <button onClick={() => setQuery(r.split(" ")[0])} className="w-full rounded-lg py-2 text-left text-sm">{r}</button>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="mt-4 flex-1 overflow-y-auto px-4 pb-6">
            <p className="mb-2 text-xs text-zinc-500" aria-live="polite">{results.length} result{results.length === 1 ? "" : "s"}</p>
            {results.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10 text-center">
                <p className="text-3xl">🔍</p>
                <p className="mt-2 text-sm font-medium">No matches</p>
                <button onClick={() => (setPicked([]), setCap(200), setQuery(""))} className="mt-3 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white">Clear filters</button>
              </motion.div>
            ) : (
              <ul className="grid grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                  {results.map((p) => (
                    <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={t} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                      <img src={`/demo/photo-${p.img}.jpg`} alt="" className="aspect-square w-full object-cover" />
                      <div className="p-2.5 text-xs"><p className="font-semibold">{p.name}</p><p className="text-zinc-500">${p.price}</p></div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        )}
      </LayoutGroup>

      <AnimatePresence>
        {sheet && (
          <>
            <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} className="absolute inset-0 bg-black/30" />
            <motion.div key="sheet" role="dialog" aria-label="Filters" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={reduced ? { duration: 0 } : spring.smooth} className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5 pb-8 shadow-2xl">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-200" />
              <div className="flex items-center justify-between"><h3 className="font-semibold">Filters</h3><button onClick={() => setSheet(false)} aria-label="Close filters"><X className="size-5 text-zinc-400" /></button></div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-zinc-400">Category</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {cats.map((c) => {
                  const on = picked.includes(c);
                  return (
                    <motion.button key={c} whileTap={reduced ? undefined : { scale: 0.92 }} aria-pressed={on} onClick={() => (haptic(), setPicked((p) => (on ? p.filter((x) => x !== c) : [...p, c])))} className={`rounded-full px-3.5 py-1.5 text-sm ring-1 transition-colors ${on ? "bg-zinc-900 text-white ring-zinc-900" : "ring-zinc-200"}`}>
                      {c}
                    </motion.button>
                  );
                })}
              </div>
              <label className="mt-5 block text-xs font-medium uppercase tracking-wider text-zinc-400">Max price · <span className="text-zinc-900">${cap}</span></label>
              <input type="range" min={50} max={200} step={10} value={cap} onChange={(e) => setCap(Number(e.target.value))} aria-label="Maximum price" className="mt-2 w-full accent-zinc-900" />
              <button onClick={() => (haptic("medium"), setSheet(false))} className="mt-5 w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white">Show {results.length} results</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Phone } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;
import { FlowSearchFilter } from "@/components/kinetik/flow-search-filter";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone><FlowSearchFilter initialStep={initialStep} /></Phone>; }
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
