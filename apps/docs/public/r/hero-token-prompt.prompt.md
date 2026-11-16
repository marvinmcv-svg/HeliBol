You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Token Prompt (`hero-token-prompt`)

Enterprise-AI hero: halftone dot fields frame a prompt box that types itself, dropping in coloured data chips; "New suggestion" shuffles prompts.

## What it should do
Build an enterprise-AI hero on #f6f4ef with halftone dot fields masked to fade from both sides: two-tone H1, subtitle, lavender CTA, then a prompt card that types a sentence character by character and drops coloured inline chips (icon + label) with a pop. 'New suggestion' swaps to the next prompt and restarts typing; mono trust line beneath.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-token-prompt.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Prompt text is in an aria-live region; buttons are labelled; reduced motion shows the full prompt instantly.
- **Performance:** One 38ms interval while typing; static halftone backgrounds.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-token-prompt.tsx
```tsx
"use client";
import { useEffect, useState, type ReactNode } from "react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

type Part = string | { chip: string; icon: string; tone: string };
const prompts: Part[][] = [
  ["Spin up a ", { chip: "Client CRM App", icon: "▦", tone: "text-violet-700 bg-violet-50 border-violet-200" }, " from my ", { chip: "Contacts", icon: "☺", tone: "text-sky-700 bg-sky-50 border-sky-200" }, " and set an ", { chip: "Agent", icon: "✦", tone: "text-emerald-700 bg-emerald-50 border-emerald-200" }, " to follow up on deals that go quiet."],
  ["Summarise every ", { chip: "Support ticket", icon: "✉", tone: "text-amber-700 bg-amber-50 border-amber-200" }, " from this week into a ", { chip: "Weekly brief", icon: "▤", tone: "text-violet-700 bg-violet-50 border-violet-200" }, " for the team."],
];
const len = (p: Part[]) => p.reduce<number>((n, x) => n + (typeof x === "string" ? x.length : 1), 0);

/** Enterprise-AI hero: halftone dot fields frame a prompt box that types itself, dropping in coloured data chips; "New suggestion" shuffles prompts. */
export function HeroTokenPrompt({ title = "AI transformation", line2 = "in a box", subtitle = "Your context, your governance, your data — with apps and agents on top. Live in hours.", className }: { title?: string; line2?: string; subtitle?: string; className?: string }) {
  const reduced = useReducedMotion();
  const [p, setP] = useState(0);
  const [n, setN] = useState(reduced ? Infinity : 0);
  useEffect(() => {
    if (reduced) return setN(Infinity);
    setN(0);
    const t = setInterval(() => setN((k) => k + 1), 38);
    return () => clearInterval(t);
  }, [p, reduced]);
  let budget = n;
  const out: ReactNode[] = [];
  prompts[p].forEach((x, i) => {
    if (budget <= 0) return;
    if (typeof x === "string") { out.push(<span key={i}>{x.slice(0, budget)}</span>); budget -= x.length; }
    else { out.push(<span key={i} className={cn("mx-0.5 inline-flex animate-[k-htp-pop_.3s_ease-out] motion-reduce:animate-none items-center gap-1 rounded-md border px-1.5 text-[13px]", x.tone)}>{x.icon} {x.chip}</span>); budget -= 1; }
  });
  const dots = "radial-gradient(#c9c3b6 1.2px,transparent 1.3px) 0 0/9px 9px";
  return (
    <section className={cn("relative overflow-hidden bg-[#f6f4ef] px-6 py-12 text-center text-[#2a2620]", className)}>
      <style href="k-htp" precedence="kinetik">{"@keyframes k-htp-pop{from{transform:scale(.6);opacity:0}}"}</style>
      <div aria-hidden className="absolute inset-y-0 left-0 w-1/4 [mask-image:radial-gradient(ellipse_at_left,#000,transparent_70%)]" style={{ background: dots }} />
      <div aria-hidden className="absolute inset-y-0 right-0 w-1/4 [mask-image:radial-gradient(ellipse_at_right,#000,transparent_70%)]" style={{ background: dots }} />
      <h1 className="relative text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">{title}<span className="block text-[#7a7266]">{line2}</span></h1>
      <p className="relative mx-auto mt-4 max-w-md text-sm text-[#6b6458]">{subtitle}</p>
      <a href="#" className="relative mt-5 inline-block rounded-md bg-[#c9b8ff] px-3.5 py-2 text-xs font-medium">Contact us →</a>
      <div className="relative mx-auto mt-7 max-w-lg rounded-2xl border border-[#e4ded2] bg-[#ece8df] p-1.5 text-left shadow-sm">
        <div className="rounded-xl bg-white p-4">
          <p aria-live="polite" className="min-h-[3.5em] text-sm leading-relaxed">{out}{n < len(prompts[p]) && <span aria-hidden className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-zinc-800" />}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <button type="button" onClick={() => setP((k) => (k + 1) % prompts.length)} className="flex items-center gap-1.5 text-zinc-600 hover:text-black">⤨ New suggestion</button>
            <button type="button" aria-label="Send" className="grid size-7 place-items-center rounded-md bg-[#2a2620] text-white">→</button>
          </div>
        </div>
      </div>
      <p className="relative mt-3 font-mono text-[9px] tracking-widest text-[#9b9384] uppercase">Your data never used for training · SOC2 · GDPR</p>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroTokenPrompt } from "@/components/kinetik/hero-token-prompt";
export default function Demo() {
  return <HeroTokenPrompt className="h-full" />;
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
