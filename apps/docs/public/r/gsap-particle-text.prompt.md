You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Particle Text Morph (`gsap-particle-text`)

Thousands of particles assemble into a word, hold, scatter and re-form into the next — sampled from canvas text, tweened by GSAP, pushed around by your cursor.

## What it should do
Sample each word: draw it centered on an offscreen canvas, read alpha every density px into target points. Keep a particle pool; gsap.to(particles, { x: i => target.x, y: i => target.y, a: 1 (0 for extras), duration 1.3, expo.inOut, stagger { amount .6, from random } }); to switch, scatter to random positions (power2.in) then form the next word. Draw all particles each gsap.ticker tick, offsetting those within 70px of the pointer.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-particle-text.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Canvas is aria-hidden; the current word is announced via a polite sr-only live region. Reduced motion draws the first word statically.
- **Performance:** One canvas redrawn on gsap.ticker; particle objects tweened directly (no DOM).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-particle-text.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapParticleTextProps {
  /** Words to cycle through. */
  words: string[];
  /** Seconds each word holds. */
  hold?: number;
  /** Sampling step in px (lower = more particles). */
  density?: number;
  colors?: string[];
  className?: string;
}

interface P {
  x: number;
  y: number;
  tx: number;
  ty: number;
  r: number;
  c: string;
  a: number;
}

const COLORS = ["#a78bfa", "#f0abfc", "#67e8f9", "#fcd34d", "#ffffff"];

/**
 * Particles assemble into a word, hold, scatter and re-form into the next one. Text is drawn
 * to an offscreen canvas and sampled into target points; GSAP tweens every particle's x/y with
 * a staggered expo ease (gsap.ticker draws one canvas). The pointer pushes particles away.
 */
export function GsapParticleText({ words, hold = 2.4, density = 5, colors = COLORS, className }: GsapParticleTextProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const parts = useRef<P[]>([]);
  const mouse = useRef<{ x: number; y: number } | null>(null);
  const [label, setLabel] = useState(words[0]);
  const reduced = useReducedMotion();

  const sample = (word: string, w: number, h: number) => {
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const ctx = off.getContext("2d");
    if (!ctx) return [] as { x: number; y: number }[];
    let size = Math.min(h * 0.55, (w * 1.6) / Math.max(4, word.length));
    ctx.font = `800 ${size}px system-ui, sans-serif`;
    while (ctx.measureText(word).width > w * 0.9 && size > 10) ctx.font = `800 ${(size -= 4)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(word, w / 2, h / 2);
    const data = ctx.getImageData(0, 0, w, h).data;
    const pts: { x: number; y: number }[] = [];
    for (let y = 0; y < h; y += density) for (let x = 0; x < w; x += density) if (data[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
    return pts;
  };

  useGSAP(
    () => {
      const c = canvas.current;
      const ctx = c?.getContext("2d");
      if (!c || !ctx) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = c.clientWidth;
      const h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let wi = 0;
      const form = (word: string, first: boolean) => {
        setLabel(word);
        const pts = gsap.utils.shuffle(sample(word, w, h));
        const ps = parts.current;
        while (ps.length < pts.length) ps.push({ x: Math.random() * w, y: Math.random() * h, tx: 0, ty: 0, r: gsap.utils.random(1, 2.2), c: gsap.utils.random(colors), a: 0 });
        ps.forEach((p, i) => {
          const t = pts[i % pts.length];
          const extra = i >= pts.length;
          p.tx = t.x + (extra ? gsap.utils.random(-2, 2) : 0);
          p.ty = t.y + (extra ? gsap.utils.random(-2, 2) : 0);
          if (reduced) Object.assign(p, { x: p.tx, y: p.ty, a: extra ? 0 : 1 });
        });
        if (reduced) return draw();
        gsap.to(ps, {
          x: (i: number) => ps[i].tx,
          y: (i: number) => ps[i].ty,
          a: (i: number) => (i >= pts.length ? 0 : 1),
          duration: first ? 1.6 : 1.3,
          ease: "expo.inOut",
          stagger: { amount: 0.6, from: "random" },
          overwrite: true,
        });
      };

      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        const m = mouse.current;
        for (const p of parts.current) {
          let { x, y } = p;
          if (m) {
            const dx = x - m.x;
            const dy = y - m.y;
            const d = Math.hypot(dx, dy);
            if (d < 70) {
              const f = (70 - d) / 70;
              x += (dx / (d || 1)) * f * 28;
              y += (dy / (d || 1)) * f * 28;
            }
          }
          ctx.globalAlpha = p.a;
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };

      form(words[0], true);
      if (reduced) return;
      gsap.ticker.add(draw);
      const cycle = gsap.delayedCall(hold + 1.6, function next() {
        wi = (wi + 1) % words.length;
        gsap.to(parts.current, { x: () => gsap.utils.random(0, w) as number, y: () => gsap.utils.random(0, h) as number, duration: 0.6, ease: "power2.in", stagger: { amount: 0.2, from: "random" }, onComplete: () => form(words[wi], false) });
        gsap.delayedCall(hold + 2, next);
      });
      return () => {
        gsap.ticker.remove(draw);
        cycle.kill();
      };
    },
    { scope: wrap, dependencies: [words.join("|"), reduced, density] },
  );

  useEffect(() => () => void (parts.current = []), []);

  return (
    <div
      ref={wrap}
      onPointerMove={(e) => {
        const r = canvas.current!.getBoundingClientRect();
        mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }}
      onPointerLeave={() => (mouse.current = null)}
      className={cn("relative", className)}
    >
      <canvas ref={canvas} aria-hidden className="h-full w-full" />
      <span className="sr-only" aria-live="polite">{label}</span>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { GsapParticleText } from "@/components/kinetik/gsap-particle-text";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(70%_60%_at_50%_50%,rgba(76,29,149,0.35),transparent)]">
      <GsapParticleText className="h-full w-full" words={["KINETIK", "MOTION", "GSAP", "PLAY"]} />
      <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">Move your cursor through the letters</p>
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
