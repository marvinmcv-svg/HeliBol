You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Liquid Metaballs (`three-metaballs`)

Glossy liquid metaballs (marching cubes) drift on looping paths and merge like lava-lamp wax; an extra blob follows the pointer so you can pull the liquid around. Colours blend where blobs meet.

## What it should do
Build liquid metaballs with React Three Fiber + drei MarchingCubes (enableColors, physical clearcoat material with vertexColors); each MarchingCube moves on a Lissajous path in useFrame; add one more that lerps toward the pointer; light with Environment Lightformers.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-metaballs.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Canvas is decorative. Reduced motion: frozen blobs, no pointer blob, still frame.
- **Performance:** drei MarchingCubes at resolution 56 (lower on mobile); paused off-screen.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-metaballs.tsx
```tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MarchingCube, MarchingCubes } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export interface ThreeMetaballsProps {
  /** Colours of the blobs; one blob per colour (plus the pointer blob). */
  colors?: string[];
  /** Marching-cubes grid resolution (quality vs. cost). */
  resolution?: number;
  className?: string;
}

const DEFAULT_COLORS = ["#a78bfa", "#f472b6", "#22d3ee", "#facc15", "#34d399"];

function Blob({ color, i, n, reduced }: { color: string; i: number; n: number; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const c = useMemo(() => new THREE.Color(color), [color]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = reduced ? i : clock.elapsedTime * 0.45 + (i / n) * Math.PI * 2;
    ref.current.position.set(Math.sin(t * 1.1 + i) * 0.42, Math.cos(t * 0.9 + i * 2) * 0.32, Math.sin(t * 0.7 + i * 3) * 0.25);
  });
  return <MarchingCube ref={ref} strength={0.5} subtract={12} color={c} />;
}

function PointerBlob() {
  const ref = useRef<THREE.Group>(null);
  const v = useRef(new THREE.Vector3());
  const white = useMemo(() => new THREE.Color("#ffffff"), []);
  useFrame(({ pointer }) => {
    if (!ref.current) return;
    v.current.set(pointer.x * 0.55, pointer.y * 0.4, 0.15);
    ref.current.position.lerp(v.current, 0.12);
  });
  return <MarchingCube ref={ref} strength={0.45} subtract={12} color={white} />;
}

/**
 * Liquid metaballs (marching cubes via drei): glossy blobs drift on looping paths and merge into one
 * another like lava-lamp wax; an extra blob follows the pointer so you can pull the liquid around.
 * Vertex colours blend where blobs meet. Lazy-load; pauses off-screen.
 */
export function ThreeMetaballs({ colors = DEFAULT_COLORS, resolution = 56, className }: ThreeMetaballsProps) {
  const reduced = useReducedMotion();
  return (
    <Canvas3DShell className={className} maxDpr={1.75} camera={{ position: [0, 0, 3.2], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={2} />
      <MarchingCubes resolution={resolution} maxPolyCount={22000} enableUvs={false} enableColors scale={2.2}>
        <meshPhysicalMaterial vertexColors roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} metalness={0.1} />
        {colors.map((c, i) => <Blob key={i} color={c} i={i} n={colors.length} reduced={reduced} />)}
        {!reduced && <PointerBlob />}
      </MarchingCubes>
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer intensity={2} color="#c4b5fd" position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer intensity={2} color="#67e8f9" position={[4, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
      </Environment>
    </Canvas3DShell>
  );
}
```

## Usage example
```tsx
"use client";
import { ThreeMetaballs } from "@/components/kinetik/three-metaballs";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_45%,#1f1235,#07040d_70%)] text-white">
      <ThreeMetaballs />
      <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center">
        <h3 className="text-2xl font-semibold tracking-tight">Liquid by nature</h3>
        <p className="text-sm text-white/55">Move your cursor to pull the blobs</p>
      </div>
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
