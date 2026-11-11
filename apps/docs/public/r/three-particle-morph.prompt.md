You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Particle Morph (`three-particle-morph`)

Thousands of particles flow between shapes — sphere, torus, DNA helix, cube, wave — each easing at its own rate so the morph ripples instead of snapping.

## What it should do
Build a React Three Fiber particle morph. Precompute Float32Array target positions for each shape (Fibonacci sphere, torus, double helix, cube surface, wave grid) with the same particle count. In useFrame, move every particle toward the current target with a per-index rate (k = dt·(1.6 + (i%97)/40)) so the morph ripples, flag the position attribute for update, rotate slowly and tilt toward the pointer. Advance the target every `hold` seconds. Additive blending, vertex colours lerped across two colours. Render inside a canvas shell that pauses off-screen and renders a still frame under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-particle-morph.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.
- **Performance:** One Points draw call; positions updated on the CPU (8k particles ≈ 0.3 ms). Lower `count` on mobile.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-particle-morph.tsx
```tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export type MorphShape = "sphere" | "torus" | "helix" | "cube" | "wave";

export interface ThreeParticleMorphProps {
  /** Shapes to cycle through, in order. */
  shapes?: MorphShape[];
  /** Number of particles. 4–12k is a good range. */
  count?: number;
  /** Seconds each shape holds before morphing to the next. */
  hold?: number;
  colors?: [string, string];
  className?: string;
  /** Called with the index of the shape the particles are heading to. */
  onShapeChange?: (index: number) => void;
}

const DEFAULT_SHAPES: MorphShape[] = ["sphere", "torus", "helix", "cube", "wave"];

function shapePositions(shape: MorphShape, n: number) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    let x = 0, y = 0, z = 0;
    if (shape === "sphere") {
      // Fibonacci sphere: even spacing, no poles clumping
      const phi = Math.acos(1 - 2 * (i + 0.5) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      x = Math.cos(theta) * Math.sin(phi) * 1.6; y = Math.cos(phi) * 1.6; z = Math.sin(theta) * Math.sin(phi) * 1.6;
    } else if (shape === "torus") {
      const u = t * Math.PI * 2 * 40, v = t * Math.PI * 2;
      const r = 1.2 + 0.45 * Math.cos(u);
      x = r * Math.cos(v); y = 0.45 * Math.sin(u); z = r * Math.sin(v);
    } else if (shape === "helix") {
      const strand = i % 2 ? Math.PI : 0;
      const a = t * Math.PI * 8 + strand;
      const jitter = ((i * 9301 + 49297) % 233280) / 233280 - 0.5;
      x = Math.cos(a) * 0.9 + jitter * 0.12; y = (t - 0.5) * 3.6; z = Math.sin(a) * 0.9 + jitter * 0.12;
    } else if (shape === "cube") {
      const face = i % 6, a = ((i * 7919) % n) / n * 2 - 1, b = ((i * 104729) % n) / n * 2 - 1, s = 1.15;
      const p = [[s, a, b], [-s, a, b], [a, s, b], [a, -s, b], [a, b, s], [a, b, -s]][face];
      [x, y, z] = [p[0] * s, p[1] * s, p[2] * s];
    } else {
      const side = Math.ceil(Math.sqrt(n));
      const gx = (i % side) / side - 0.5, gz = Math.floor(i / side) / side - 0.5;
      x = gx * 4; z = gz * 4; y = Math.sin(gx * 9) * Math.cos(gz * 9) * 0.35;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}

function Particles({ shapes, count, hold, colors, onShapeChange }: Required<Omit<ThreeParticleMorphProps, "className" | "onShapeChange">> & Pick<ThreeParticleMorphProps, "onShapeChange">) {
  const reduced = useReducedMotion();
  const points = useRef<THREE.Points>(null);
  const targets = useMemo(() => shapes.map((s) => shapePositions(s, count)), [shapes, count]);
  const { positions, colorArr } = useMemo(() => {
    const c1 = new THREE.Color(colors[0]), c2 = new THREE.Color(colors[1]), c = new THREE.Color();
    const colorArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) colorArr.set(c.copy(c1).lerp(c2, i / count).toArray(), i * 3);
    return { positions: targets[0].slice(), colorArr };
  }, [targets, colors, count]);
  const state = useRef({ index: 0, clock: 0 });

  useFrame((s, dt) => {
    const p = points.current;
    if (!p) return;
    const st = state.current;
    st.clock += dt;
    if (st.clock > hold) {
      st.clock = 0;
      st.index = (st.index + 1) % targets.length;
      onShapeChange?.(st.index);
    }
    const target = targets[st.index];
    const arr = p.geometry.attributes.position.array as Float32Array;
    // Per-particle ease toward the target; the index-based rate staggers the morph like a wave.
    for (let i = 0; i < arr.length; i += 3) {
      const k = Math.min(1, dt * (1.6 + ((i / 3) % 97) / 40));
      arr[i] += (target[i] - arr[i]) * k;
      arr[i + 1] += (target[i + 1] - arr[i + 1]) * k;
      arr[i + 2] += (target[i + 2] - arr[i + 2]) * k;
    }
    p.geometry.attributes.position.needsUpdate = true;
    p.rotation.y += dt * 0.15;
    p.rotation.x += (s.pointer.y * 0.35 - p.rotation.x) * 0.05;
    p.rotation.z += (-s.pointer.x * 0.2 - p.rotation.z) * 0.05;
  });

  return (
    <points ref={points} rotation={reduced ? [0.3, 0.6, 0] : undefined}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorArr, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

/**
 * Thousands of particles that flow from one shape to the next (sphere → torus → helix → cube → wave).
 * Each particle eases to its slot at a slightly different rate, so the morph ripples instead of snapping.
 */
export function ThreeParticleMorph({ shapes = DEFAULT_SHAPES, count = 8000, hold = 3.2, colors = ["#a78bfa", "#22d3ee"], className, onShapeChange }: ThreeParticleMorphProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 5.2], fov: 45 }}>
      <Particles shapes={shapes} count={count} hold={hold} colors={colors} onShapeChange={onShapeChange} />
    </Canvas3DShell>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { ThreeParticleMorph, type MorphShape } from "@/components/kinetik/three-particle-morph";

const shapes: MorphShape[] = ["sphere", "torus", "helix", "cube", "wave"];

export default function Demo() {
  const [i, setI] = useState(0);
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_45%,rgb(124_58_237/.25),#05010d_70%)] text-white">
      <ThreeParticleMorph shapes={shapes} onShapeChange={setI} />
      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center gap-2 text-[11px] uppercase tracking-[0.2em]">
        {shapes.map((s, n) => (
          <span key={s} className={n === i ? "rounded-full bg-white px-2.5 py-1 text-black" : "px-2.5 py-1 opacity-50"}>{s}</span>
        ))}
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
