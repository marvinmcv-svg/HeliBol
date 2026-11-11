You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Hero — AI Particle Brain (`hero-ai-particles`)

AI product hero: a particle cloud morphing between shapes behind the headline, a smart-animate capability word, and a prompt box whose placeholder types example requests.

## What it should do
Compose an AI hero: ThreeParticleMorph (sphere/helix/torus/wave) filling the right side, a left gradient for legibility, a pill badge, an H1 ending in a TextSmartAnimate word (Reasoning/Memory/Planning/Acting), a subline, and a glass prompt form using InputTypingPlaceholder with a send button.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei motion lucide-react`
- Put the component at `components/kinetik/hero-ai-particles.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/three-particle-morph.json https://marvzkineticlibrary.vercel.app/r/text-smart-animate.json https://marvzkineticlibrary.vercel.app/r/input-typing-placeholder.json
```

## Non-negotiables
- **Accessibility:** Headline and form are real HTML; the 3D layer is decorative; capability changes announced politely. Reduced motion: still particles, crossfading words.
- **Performance:** three.js loaded only with this block; canvas pauses off-screen.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-ai-particles.tsx
```tsx
"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ThreeParticleMorph, type MorphShape } from "@/components/kinetik/three-particle-morph";
import { TextSmartAnimate } from "@/components/kinetik/text-smart-animate";
import { InputTypingPlaceholder } from "@/components/kinetik/input-typing-placeholder";
import { useReducedMotion } from "@/lib/kinetik/core";

const shapes: MorphShape[] = ["sphere", "helix", "torus", "wave"];
const captions = ["Reasoning", "Memory", "Planning", "Acting"];

/** AI product hero: a particle "brain" morphing between shapes behind the headline, a typing prompt box and a capability ticker that follows the morph. */
export function HeroAiParticles() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  return (
    <section className="relative h-full min-h-[560px] overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_70%_40%,#1e1b4b,#030014_65%)] text-white">
      <div className="absolute inset-0 md:left-[35%]">
        <ThreeParticleMorph shapes={shapes} hold={3} colors={["#c4b5fd", "#22d3ee"]} onShapeChange={setI} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#030014] via-[#030014]/70 to-transparent md:via-transparent" />
      <div className="relative flex h-full max-w-xl flex-col justify-center gap-6 p-8 sm:p-12">
        <motion.span initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-violet-200 backdrop-blur">
          ● Nomi 3 — now with long-term memory
        </motion.span>
        <h1 className="text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[1.02] tracking-tight">
          An agent that is<br />
          <TextSmartAnimate words={captions} interval={3000} className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent" />
        </h1>
        <p className="max-w-md text-white/60">Give it a goal. It plans, remembers context across weeks, and acts in the tools you already use.</p>
        <form onSubmit={(e) => e.preventDefault()} className="flex max-w-md items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-white [&_input]:shadow-none">
          <InputTypingPlaceholder aria-label="Ask Nomi" suggestions={["plan my launch week", "summarise yesterday's calls", "draft replies to my inbox"]} prefix="Ask Nomi to" className="flex-1" />
          <button type="submit" aria-label="Send" className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-black"><ArrowRight className="size-4" /></button>
        </form>
        <p className="text-xs text-white/40" aria-live="polite">Now visualising: {captions[i]}</p>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroAiParticles } from "@/components/kinetik/hero-ai-particles";
export default function Demo() {
  return <div className="h-full p-3"><HeroAiParticles /></div>;
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
