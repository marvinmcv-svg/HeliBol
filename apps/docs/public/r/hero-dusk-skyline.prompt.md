You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Dusk Skyline (`hero-dusk-skyline`)

Corporate hero: black utility bar and white nav over a dusk skyline (drawn placeholder or your photo) with thin oversized type, then a calm statement section below.

## What it should do
Recreate a corporate identity hero: black utility bar (announcement, phone, chat, search, region), white nav (sunburst wordmark, 4 dropdowns, black 'Free trial', outlined 'Contact us', Login); a dusk skyline band (photo slot or procedural SVG: low towers left, dense towers + spire right, flickering windows, slow pan, horizon haze) with a light-weight 2-line H1 (~5.3vw) and a 4-line paragraph centered in white; then a white section with a light 2-line statement.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-dusk-skyline.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 + paragraph; skyline SVG is aria-hidden; reduced motion stops the pan, sky shift and twinkle.
- **Performance:** SVG rects with opacity step animations; one slow transform pan.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-dusk-skyline.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap";
const css = `
.k-hds{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.k-hds .sky{background:linear-gradient(180deg,#8f8a87 0%,#b49a8a 30%,#d1a98c 55%,#a88a78 75%,#5b4c47 100%);animation:k-hds-sky 16s ease-in-out infinite alternate}
@keyframes k-hds-sky{to{filter:brightness(.88) saturate(1.1)}}
.k-hds .city{animation:k-hds-pan 30s ease-in-out infinite alternate}
@keyframes k-hds-pan{to{transform:translateX(-3%)}}
.k-hds .win{animation:k-hds-twinkle var(--s) steps(2) infinite;animation-delay:var(--d)}
@keyframes k-hds-twinkle{50%{opacity:.1}}
.k-hds .in{animation:k-hds-in 1.4s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hds-in{from{opacity:0;filter:blur(10px)}}
@media (prefers-reduced-motion:reduce){.k-hds *{animation:none!important}}
[data-reduce-motion] .k-hds *{animation:none!important}`;

const towers: [number, number, number][] = Array.from({ length: 70 }, (_, i) => {
  const x = i * 11.6;
  const r = (i * 53) % 60;
  const h = x > 430 ? 70 + r + ((i * 29) % 90) : 25 + r * 0.8; // low skyline left, dense towers right
  return [x, h, 8 + ((i * 7) % 9)];
});

/** Corporate hero: black utility bar and white nav over a dusk skyline (drawn placeholder or your photo) with thin oversized type, then a calm statement section below. */
export function HeroDuskSkyline({ title = "The World's Identity Company™", subtitle = "We're the leading independent partner for identity management. Our vision is to free everyone to safely use any technology. Now that might sound like a seriously lofty pursuit, but we're proving it's possible — with seamless and secure access, authentication, and authorization.", image, className }: { title?: string; subtitle?: string; image?: string; className?: string }) {
  return (
    <section className={cn("k-hds flex flex-col overflow-hidden bg-[#fcfbf8] text-[#1d1d21]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hds" precedence="kinetik">{css}</style>
      <div className="flex justify-between bg-[#1d1d21] px-[6.5%] py-2.5 text-[12px] text-white"><span className="truncate">Vanta secures AI. Vantane | Las Vegas | Sept 24–… <a href="#" className="ml-2 underline">Save $200 →</a></span><span className="hidden gap-6 lg:flex"><span>+1 (800) 425-1267</span><span>◫ Chat with Sales</span><span>⌕ Search</span><span>◍ United States ⌄</span></span></div>
      <nav className="flex items-center justify-between px-[6.5%] py-3.5 text-[13px] whitespace-nowrap">
        <span className="flex items-center gap-24"><b className="flex items-center gap-1.5 text-[26px] font-medium tracking-tight"><span aria-hidden className="text-[28px] leading-none">✺</span>vanta</b><span className="hidden gap-12 lg:flex">{["Products", "Why Vanta", "Developers", "Resources"].map((n) => <a key={n} href="#">{n} ⌄</a>)}</span></span>
        <span className="flex items-center gap-3"><a href="#" className="rounded-sm bg-[#1d1d21] px-5 py-3 text-white">Free trial</a><a href="#" className="rounded-sm border border-[#1d1d21] px-5 py-3">Contact us</a><a href="#" className="ml-4">◯ Login</a></span>
      </nav>
      <div className="relative isolate overflow-hidden px-6 pt-[4%] pb-[7%] text-center text-white">
        {image ? <div aria-hidden className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} /> : <div aria-hidden className="sky absolute inset-0 -z-20" />}
        {!image && (
          <svg aria-hidden viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice" className="city absolute inset-x-0 bottom-0 -z-10 h-full w-[104%]">
            {towers.map(([x, h, w], i) => (
              <g key={i}>
                <rect x={x} y={320 - h} width={w} height={h} fill={i % 2 ? "#2b2523" : "#3a302c"} />
                {Array.from({ length: Math.floor(h / 26) }, (_, r) => <rect key={r} className="win" x={x + 4 + (r % 2) * (w / 2 - 2)} y={320 - h + 8 + r * 24} width="3" height="5" fill="#f6c48a" opacity=".7" style={{ ["--s" as string]: `${3 + ((i + r) % 5)}s`, ["--d" as string]: `${-((i * r) % 7)}s` }} />)}
              </g>
            ))}
            <rect x="586" y="10" width="3" height="40" fill="#2b2523" /><path d="M572 60 L587 30 L602 60 V320 H572Z" fill="#2f2826" /><rect x="0" y="292" width="800" height="28" fill="#2a2421" />
          </svg>
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_45%,#c9a48a55_70%,#1a141266)]" />
        <h1 className="in mx-auto max-w-[16ch] text-[clamp(2.6rem,5.3vw,5rem)] leading-[1.12] font-light tracking-[-.01em]">{title}</h1>
        <p className="in mx-auto mt-5 max-w-[50rem] text-[clamp(.9rem,1.45vw,1.35rem)] leading-snug text-white/95" style={{ ["--d" as string]: ".3s" }}>{subtitle}</p>
      </div>
      <h2 className="mx-auto max-w-[24ch] flex-1 px-6 pt-[6%] text-center text-[clamp(1.8rem,3.7vw,3.5rem)] leading-[1.15] font-light tracking-[-.01em]">We're building a world where Identity belongs to you</h2>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroDuskSkyline } from "@/components/kinetik/hero-dusk-skyline";
export default function Demo() {
  return <HeroDuskSkyline className="h-full" />;
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
