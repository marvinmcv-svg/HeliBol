You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Floating Shapes (`three-floating-shapes`)

Playful clay-like primitives bobbing in a soft studio — pointer parallax, hover swell, contact shadows.

## What it should do
Build a playful 3D hero: ~14 primitives (sphere, torus, capsule, box, cone, knot) placed on a golden-angle spiral, each wrapped in drei Float with clearcoat physical materials from a candy palette. Hovering a shape eases its scale up 18%. A Rig group eases its rotation toward the pointer. drei ContactShadows under the scene, Environment Lightformers for soft light.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-floating-shapes.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.
- **Performance:** 14 meshes with physical materials; ContactShadows rendered once per frame at low res.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-floating-shapes.tsx
```tsx
"use client";
import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export interface ThreeFloatingShapesProps {
  /** Candy palette used round-robin for the shapes. */
  palette?: string[];
  count?: number;
  className?: string;
}

const DEFAULT_PALETTE = ["#fb7185", "#fbbf24", "#34d399", "#60a5fa", "#c084fc", "#f9a8d4"];
const KINDS = ["sphere", "torus", "capsule", "box", "cone", "knot"] as const;

function Shape({ kind, color, position, scale, speed }: { kind: (typeof KINDS)[number]; color: string; position: [number, number, number]; scale: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const hovered = useRef(0);
  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    const s = scale * (1 + hovered.current * 0.18);
    m.scale.lerp(new THREE.Vector3(s, s, s), Math.min(1, dt * 10));
  });
  return (
    <Float speed={speed} rotationIntensity={1.2} floatIntensity={1.4}>
      <mesh ref={ref} position={position} scale={scale} onPointerOver={() => (hovered.current = 1)} onPointerOut={() => (hovered.current = 0)}>
        {kind === "sphere" && <sphereGeometry args={[0.5, 48, 48]} />}
        {kind === "torus" && <torusGeometry args={[0.42, 0.17, 32, 96]} />}
        {kind === "capsule" && <capsuleGeometry args={[0.25, 0.5, 12, 32]} />}
        {kind === "box" && <boxGeometry args={[0.7, 0.7, 0.7]} />}
        {kind === "cone" && <coneGeometry args={[0.45, 0.8, 48]} />}
        {kind === "knot" && <torusKnotGeometry args={[0.32, 0.11, 160, 24]} />}
        <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
    </Float>
  );
}

function Rig({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current || reduced) return;
    g.current.rotation.y += (s.pointer.x * 0.35 - g.current.rotation.y) * 0.05;
    g.current.rotation.x += (-s.pointer.y * 0.2 - g.current.rotation.x) * 0.05;
  });
  return <group ref={g}>{children}</group>;
}

/** Playful clay-like primitives bobbing in a soft studio, with pointer parallax and hover swell — the "jelly garden" hero. */
export function ThreeFloatingShapes({ palette = DEFAULT_PALETTE, count = 14, className }: ThreeFloatingShapesProps) {
  const reduced = useReducedMotion();
  const shapes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = i * 2.399; // golden angle spreads them evenly
        const r = 1.2 + (i % 4) * 0.55;
        return {
          kind: KINDS[i % KINDS.length],
          color: palette[i % palette.length],
          position: [Math.cos(a) * r * 1.4, Math.sin(a) * r * 0.7, -((i * 37) % 5) * 0.4] as [number, number, number],
          scale: 0.7 + ((i * 13) % 5) * 0.12,
          speed: reduced ? 0 : 1 + (i % 3) * 0.4,
        };
      }),
    [count, palette, reduced],
  );
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 7], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={2.4} />
      <Rig>
        {shapes.map((s, i) => <Shape key={i} {...s} />)}
      </Rig>
      <ContactShadows position={[0, -2.6, 0]} opacity={0.35} scale={14} blur={2.6} far={5} />
      <Environment resolution={128}>
        <Lightformer intensity={3} position={[0, 4, 4]} scale={[8, 4, 1]} />
        <Lightformer intensity={1.5} position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[4, 4, 1]} />
      </Environment>
    </Canvas3DShell>
  );
}
```

## Usage example
```tsx
"use client";
import { ThreeFloatingShapes } from "@/components/kinetik/three-floating-shapes";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[#fdf2f8] text-zinc-900">
      <ThreeFloatingShapes />
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div className="rounded-3xl bg-white/60 px-6 py-4 backdrop-blur-md">
          <h3 className="text-3xl font-black tracking-tight sm:text-5xl">Make it playful.</h3>
          <p className="mt-1 text-sm text-zinc-600">Hover a shape · move to tilt the scene</p>
        </div>
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
