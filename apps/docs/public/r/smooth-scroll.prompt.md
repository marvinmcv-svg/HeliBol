You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Smooth Scroll (Lenis) (`smooth-scroll`)

Lenis provider with GSAP ticker sync, anchor links, a useLenis() hook and an optional contained mode for scrolling a panel.

## What it should do
Add a SmoothScroll provider using Lenis: create Lenis with `autoRaf: false`, `anchors: true`, drive it from `gsap.ticker.add(t => lenis.raf(t * 1000))` with `lagSmoothing(0)`, call `ScrollTrigger.update` on Lenis scroll, expose the instance through context (`useLenis()`), support a contained wrapper/content mode, destroy on unmount, and skip Lenis entirely when reduced motion is on.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **lenis**.
- Install dependencies: `npm i lenis gsap`
- Put the component at `components/kinetik/smooth-scroll.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Keeps the native scrollbar and keyboard scrolling. Disabled entirely under reduced motion. Add data-lenis-prevent to nested scroll areas (modals, code blocks).
- **Performance:** Single RAF via gsap.ticker shared with ScrollTrigger (no double loops).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/smooth-scroll.tsx
```tsx
"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);
/** Access the Lenis instance, e.g. `useLenis()?.scrollTo("#pricing")`. */
export const useLenis = () => useContext(LenisContext);

export interface SmoothScrollProps {
  children: ReactNode;
  /** Scroll a wrapper element instead of the window (wrapper = this component's root). */
  contained?: boolean;
  /** 0–1, lower = smoother/heavier. */
  lerp?: number;
  /** Keep native touch scrolling on phones (recommended). */
  syncTouch?: boolean;
  className?: string;
}

/** Lenis smooth scrolling synced to GSAP's ticker so ScrollTrigger stays frame-perfect. */
export function SmoothScroll({ children, contained = false, lerp = 0.09, syncTouch = false, className }: SmoothScrollProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({
      lerp,
      syncTouch,
      anchors: true,
      autoRaf: false,
      ...(contained && wrapper.current && content.current ? { wrapper: wrapper.current, content: content.current } : {}),
    });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced, lerp, syncTouch, contained]);

  return (
    <LenisContext.Provider value={lenis}>
      {contained ? (
        <div ref={wrapper} className={cn("h-full overflow-y-auto", className)}>
          <div ref={content}>{children}</div>
        </div>
      ) : (
        children
      )}
    </LenisContext.Provider>
  );
}

export type { RefObject };
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { SmoothScroll, useLenis } from "@/components/kinetik/smooth-scroll";

function Nav() {
  const lenis = useLenis();
  return (
    <div className="sticky top-0 z-10 flex gap-2 border-b border-border bg-background/80 p-3 text-xs backdrop-blur">
      {["one", "two", "three"].map((id) => (
        <button key={id} onClick={() => lenis?.scrollTo(`#k-ss-${id}`, { offset: -50 })} className="rounded-full border border-border px-3 py-1 hover:bg-accent">
          Go to {id}
        </button>
      ))}
      <span className="ml-auto self-center text-muted-foreground">{lenis ? "Lenis active" : "Native scroll"}</span>
    </div>
  );
}

export default function Demo() {
  return (
    <SmoothScroll contained className="h-full">
      <Nav />
      <div className="space-y-6 p-6">
        {["one", "two", "three"].map((id, i) => (
          <section key={id} id={`k-ss-${id}`} className="space-y-3">
            <h3 className="text-2xl font-semibold capitalize">Section {id}</h3>
            <img src={photos[i * 2]} alt="" className="aspect-video w-full rounded-2xl object-cover" />
            <p className="text-sm text-muted-foreground">Wheel or trackpad here — momentum is interpolated (lerp 0.09) while the native scrollbar, find-in-page and keyboard scrolling keep working.</p>
          </section>
        ))}
      </div>
    </SmoothScroll>
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
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
