You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Nested Frames (`hero-nested-frames`)

Manifesto hero: white nav bar over a deep-purple field where the copy sits in a glowing rounded panel wrapped by concentric frames that pulse outward.

## What it should do
Recreate a manifesto hero: light nav bar (serif wordmark, dropdowns, Login, outlined 'Contact Sales', dark 'Get Started Free'); deep purple #1c0f45 field with a central rounded panel (28px radius, #6a4bff border, radial purple glow drifting via @property) wrapped by three concentric frames inset 38px apart that pulse in sequence. Centered H1 (~5.3vw, DM Sans 500), 2-line subtitle (~2.1vw) and a circled ↓ that bobs.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-nested-frames.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1; frames are aria-hidden; scroll cue is a labelled link; all pulses stop under reduced motion.
- **Performance:** Three bordered divs with box-shadow pulses plus one @property gradient shift.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-nested-frames.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=Newsreader:opsz,wght@6..72,500&display=swap";
const css = `
.k-hnf{font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif}
.k-hnf .frame{position:absolute;border:2px solid #4b2fc9;border-radius:calc(28px + var(--i)*14px);inset:calc(var(--i)*-38px);animation:k-hnf-pulse 4.5s ease-in-out infinite;animation-delay:calc(var(--i)*.3s)}
@keyframes k-hnf-pulse{50%{border-color:#8b74ff;box-shadow:0 0 30px #6d4aff44}}
@property --gx{syntax:"<percentage>";initial-value:35%;inherits:false}
.k-hnf .glow{background:radial-gradient(ellipse at var(--gx) 20%,#5b3fa8 0,#3a2482 35%,#24145a 75%);animation:k-hnf-glow 10s ease-in-out infinite alternate}
@keyframes k-hnf-glow{to{--gx:60%}}
.k-hnf .in{animation:k-hnf-in 1.1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hnf-in{from{opacity:0;transform:translateY(14px);filter:blur(8px)}}
.k-hnf .bob{animation:k-hnf-bob 1.8s ease-in-out infinite}
@keyframes k-hnf-bob{50%{transform:translateY(5px)}}
@media (prefers-reduced-motion:reduce){.k-hnf *{animation:none!important}}
[data-reduce-motion] .k-hnf *{animation:none!important}`;

/** Manifesto hero: white nav bar over a deep-purple field where the copy sits in a glowing rounded panel wrapped by concentric frames that pulse outward. */
export function HeroNestedFrames({ title = "We believe in builders", subtitle = "People that endeavor to create and lead change. Whether it's through building new companies, products, services, brands, or communities.", className }: { title?: string; subtitle?: string; className?: string }) {
  return (
    <section className={cn("k-hnf flex flex-col overflow-hidden bg-[#1c0f45] text-white", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hnf" precedence="kinetik">{css}</style>
      <nav className="flex items-center justify-between bg-[#f4f3f8] whitespace-nowrap px-[6.5%] py-3 text-[13px] text-[#1c1340]">
        <span className="flex items-center gap-10"><span className="text-[22px] font-medium tracking-tight" style={{ fontFamily: "Newsreader,serif" }}>metricly</span><span className="hidden gap-7 lg:flex">{["Platform", "Solutions", "Resources"].map((n) => <a key={n} href="#">{n} ⌄</a>)}<a href="#">Pricing</a></span></span>
        <span className="flex items-center gap-4"><a href="#" className="font-medium">Login</a><a href="#" className="rounded-full border border-[#1c1340] px-4 py-2">Contact Sales</a><a href="#" className="rounded-full bg-[#1c1340] px-4 py-2 text-white">Get Started Free</a></span>
      </nav>
      <div className="relative flex-1 px-[2%] pt-[2.2%]">
        <div className="relative mx-[6.5%] mt-[6%] mb-[11%] h-[64%] min-h-80">
          {[3, 2, 1].map((i) => <span key={i} aria-hidden className="frame" style={{ ["--i" as string]: i }} />)}
          <div className="glow relative grid h-full place-items-center rounded-[28px] border-2 border-[#6a4bff] px-6 text-center">
            <div>
              <h1 className="in text-[clamp(2.4rem,5.3vw,5rem)] font-medium tracking-[-.025em]">{title}</h1>
              <p className="in mx-auto mt-6 max-w-[58rem] text-[clamp(1rem,2.15vw,2rem)] leading-snug text-white/85" style={{ ["--d" as string]: ".15s" }}>{subtitle}</p>
              <a href="#more" aria-label="Scroll down" className="bob mx-auto mt-8 grid size-9 place-items-center rounded-full border-2 border-white/80 text-sm">↓</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroNestedFrames } from "@/components/kinetik/hero-nested-frames";
export default function Demo() {
  return <HeroNestedFrames className="h-full" />;
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

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
