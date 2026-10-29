You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Animated Beam (`animated-beam`)

Light pulses travel along curved connectors between any two elements — the go-to integrations / data-flow diagram.

## What it should do
Build an AnimatedBeam: given container/from/to refs, compute a quadratic SVG path between the endpoints' centers (recomputed with ResizeObserver), draw a faint base stroke, and overlay the same path stroked with a `userSpaceOnUse` linearGradient whose x1/x2 animate from -10% to 110% on repeat — a travelling light pulse with transparent ends. Demo: 3 app icons → AI hub → 3 destinations.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **svg**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/animated-beam.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** aria-hidden; describe the integrations in text nearby. Reduced motion: static gradient line.
- **Performance:** Only the gradient's x1/x2 animate; paths recompute on ResizeObserver.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/animated-beam.tsx
```tsx
"use client";
import { useEffect, useId, useState, type RefObject } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/kinetik/core";

export interface AnimatedBeamProps {
  container: RefObject<HTMLElement | null>;
  from: RefObject<HTMLElement | null>;
  to: RefObject<HTMLElement | null>;
  /** Bend of the curve in px (negative bends up). */
  curvature?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
  colorFrom?: string;
  colorTo?: string;
}

/** An SVG path between two elements with a light pulse travelling along it. Recomputes on resize. */
export function AnimatedBeam({ container, from, to, curvature = 0, duration = 3, delay = 0, reverse = false, colorFrom = "#a855f7", colorTo = "#22d3ee" }: AnimatedBeamProps) {
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const reduced = useReducedMotion();
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      const c = container.current?.getBoundingClientRect();
      const a = from.current?.getBoundingClientRect();
      const b = to.current?.getBoundingClientRect();
      if (!c || !a || !b) return;
      const x1 = a.left - c.left + a.width / 2;
      const y1 = a.top - c.top + a.height / 2;
      const x2 = b.left - c.left + b.width / 2;
      const y2 = b.top - c.top + b.height / 2;
      setSize({ w: c.width, h: c.height });
      setD(`M ${x1},${y1} Q ${(x1 + x2) / 2},${(y1 + y2) / 2 + curvature} ${x2},${y2}`);
    };
    update();
    const ro = new ResizeObserver(update);
    if (container.current) ro.observe(container.current);
    return () => ro.disconnect();
  }, [container, from, to, curvature]);

  const x = reverse ? ["110%", "-10%"] : ["-10%", "110%"];
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} fill="none">
      <path d={d} stroke="currentColor" strokeOpacity={0.15} strokeWidth={2} strokeLinecap="round" />
      <path d={d} stroke={`url(#${id})`} strokeWidth={2} strokeLinecap="round" />
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%" }}
          animate={reduced ? { x1: "0%", x2: "100%" } : { x1: x, x2: x.map((v) => `${parseFloat(v) + 10}%`) }}
          transition={reduced ? { duration: 0 } : { duration, delay, repeat: Infinity, ease: [0.16, 1, 0.3, 1], repeatDelay: 0.4 }}
        >
          <stop stopColor={colorFrom} stopOpacity="0" />
          <stop stopColor={colorFrom} />
          <stop offset="32.5%" stopColor={colorTo} />
          <stop offset="100%" stopColor={colorTo} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}
```

## Usage example
```tsx
"use client";
import { forwardRef, useRef, type ReactNode } from "react";
import { Cloud, Database, GitBranch, Mail, MessageSquare, Sparkles, Zap } from "lucide-react";
import { AnimatedBeam } from "@/components/kinetik/animated-beam";

const Node = forwardRef<HTMLDivElement, { children: ReactNode; big?: boolean }>(({ children, big }, ref) => (
  <div ref={ref} className={`z-10 grid place-items-center rounded-full border border-border bg-card shadow-[0_0_20px_-8px_rgb(0_0_0/.4)] ${big ? "size-16" : "size-11"}`}>{children}</div>
));
Node.displayName = "Node";

export default function Demo() {
  const c = useRef<HTMLDivElement>(null);
  const l = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const r = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const hub = useRef<HTMLDivElement>(null);
  const li = [GitBranch, MessageSquare, Mail];
  const ri = [Database, Cloud, Zap];
  return (
    <div ref={c} className="relative mx-auto flex h-full w-full max-w-lg items-center justify-between p-8 text-muted-foreground">
      <div className="flex flex-col gap-6">{li.map((I, i) => <Node key={i} ref={l[i]}><I className="size-5" /></Node>)}</div>
      <Node ref={hub} big><Sparkles className="size-7 text-brand" /></Node>
      <div className="flex flex-col gap-6">{ri.map((I, i) => <Node key={i} ref={r[i]}><I className="size-5" /></Node>)}</div>
      {l.map((ref, i) => <AnimatedBeam key={`l${i}`} container={c} from={ref} to={hub} curvature={(i - 1) * -40} delay={i * 0.4} />)}
      {r.map((ref, i) => <AnimatedBeam key={`r${i}`} container={c} from={hub} to={ref} curvature={(i - 1) * -40} delay={1 + i * 0.4} colorFrom="#22d3ee" colorTo="#34d399" />)}
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
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
