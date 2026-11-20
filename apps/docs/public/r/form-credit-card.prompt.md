You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Credit Card Form (`form-credit-card`)

Payment form with a live 3D card: digits roll into place as you type, the card skin cross-fades to the detected brand, the focused field glows on the card, and focusing CVC flips the card to its back.

## What it should do
Build a credit-card form: format number in groups of 4 and expiry as MM/YY; a 3D card (preserve-3d, front/back with backface hidden) above the inputs; digits render per character with a vertical roll; brand detected from the prefix cross-fades the gradient skin; focused fields get an outline on the card; focusing CVC rotates the card 180° with a spring.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/form-credit-card.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real labelled inputs with cc-* autocomplete and numeric keyboards; the card preview is aria-hidden. Reduced motion: no flip or roll.
- **Performance:** Per-character AnimatePresence only on the number row; one 3D flip.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/form-credit-card.tsx
```tsx
"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface FormCreditCardProps {
  onSubmit?: (card: { number: string; name: string; expiry: string; cvc: string }) => void;
  className?: string;
}

type Brand = "visa" | "mastercard" | "amex" | "card";
const brandOf = (n: string): Brand => (/^4/.test(n) ? "visa" : /^(5[1-5]|2[2-7])/.test(n) ? "mastercard" : /^3[47]/.test(n) ? "amex" : "card");
const skins: Record<Brand, string> = {
  visa: "from-indigo-600 via-blue-600 to-sky-500",
  mastercard: "from-zinc-900 via-zinc-800 to-orange-700",
  amex: "from-emerald-700 via-teal-600 to-cyan-500",
  card: "from-zinc-700 via-zinc-800 to-zinc-900",
};

/**
 * Payment form with a live 3D card: digits roll into place as you type, the card skin cross-fades
 * to the detected brand, the focused field gets a glowing outline on the card, and focusing CVC
 * flips the card to its back. Real labelled inputs with autocomplete hints.
 */
export function FormCreditCard({ onSubmit, className }: FormCreditCardProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [v, setV] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [focus, setFocus] = useState<keyof typeof v | null>(null);
  const digits = v.number.replace(/\D/g, "").slice(0, 16);
  const brand = brandOf(digits);
  const shown = (digits + "•".repeat(16 - digits.length)).replace(/(.{4})/g, "$1 ").trim();
  const flipped = focus === "cvc";
  const glow = (k: keyof typeof v) => cn("rounded-md px-1 transition-shadow duration-300", focus === k && "shadow-[0_0_0_2px_rgb(255_255_255/.8)]");

  const set = (k: keyof typeof v, raw: string) => {
    let val = raw;
    if (k === "number") val = raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (k === "expiry") val = raw.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
    if (k === "cvc") val = raw.replace(/\D/g, "").slice(0, 4);
    setV((s) => ({ ...s, [k]: val }));
  };
  const input = (k: keyof typeof v, label: string, auto: string, extra?: string) => (
    <div className={cn("space-y-1", extra)}>
      <label htmlFor={`${id}-${k}`} className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        id={`${id}-${k}`}
        value={v[k]}
        onChange={(e) => set(k, e.target.value)}
        onFocus={() => setFocus(k)}
        onBlur={() => setFocus(null)}
        autoComplete={auto}
        inputMode={k === "name" ? "text" : "numeric"}
        className="h-10 w-full rounded-xl border border-border bg-background px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );

  return (
    <form onSubmit={(e) => (e.preventDefault(), onSubmit?.(v))} className={cn("w-full max-w-sm space-y-5", className)}>
      <div className="mx-auto aspect-[1.586] w-full max-w-[19rem]" style={{ perspective: 1000 }} aria-hidden>
        <motion.div className="relative size-full" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: flipped ? 180 : 0 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16 }}>
          {/* front */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl p-5 font-mono text-white shadow-2xl [backface-visibility:hidden]">
            <AnimatePresence initial={false}>
              <motion.div key={brand} className={cn("absolute inset-0 bg-gradient-to-br", skins[brand])} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
            </AnimatePresence>
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="h-7 w-10 rounded-md bg-gradient-to-br from-yellow-200 to-amber-400" />
                <span className="text-sm font-bold uppercase italic tracking-wide">{brand === "card" ? "" : brand}</span>
              </div>
              <div className={cn("flex gap-[0.05em] text-lg tracking-widest", glow("number"))}>
                {shown.split("").map((ch, i) => (
                  <span key={i} className="relative inline-block w-[0.62em] overflow-hidden text-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span key={ch} className="inline-block" initial={reduced ? false : { y: "-100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? undefined : { y: "100%", opacity: 0 }} transition={{ duration: 0.18 }}>{ch === " " ? " " : ch}</motion.span>
                    </AnimatePresence>
                  </span>
                ))}
              </div>
              <div className="flex items-end justify-between text-xs uppercase">
                <span className={cn("max-w-[70%] truncate", glow("name"))}>{v.name || "Your name"}</span>
                <span className={glow("expiry")}>{v.expiry || "MM/YY"}</span>
              </div>
            </div>
          </div>
          {/* back */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-white shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="mt-6 h-10 bg-black" />
            <div className="mx-5 mt-4 flex items-center justify-end rounded bg-white/90 px-3 py-1.5 font-mono text-sm text-zinc-900">{v.cvc.replace(/./g, "•") || "CVC"}</div>
          </div>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {input("number", "Card number", "cc-number", "col-span-2")}
        {input("name", "Name on card", "cc-name", "col-span-2")}
        {input("expiry", "Expiry", "cc-exp")}
        {input("cvc", "CVC", "cc-csc")}
      </div>
      <button type="submit" className="h-11 w-full rounded-xl bg-foreground text-sm font-semibold text-background">Pay $49.00</button>
    </form>
  );
}
```

## Usage example
```tsx
"use client";
import { FormCreditCard } from "@/components/kinetik/form-credit-card";

export default function Demo() {
  return (
    <div className="grid h-full place-items-start justify-center overflow-y-auto p-6">
      <FormCreditCard />
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

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
