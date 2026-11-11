You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Instanced Pillar Grid (`three-instanced-grid`)

A field of 1,296 pillars (one InstancedMesh) that rise and glow under the cursor and breathe gently at rest.

## What it should do
Build an instanced pillar grid: InstancedMesh of unit boxes, size² instances. Each frame raycast the pointer onto the y=0 plane, compute each pillar's distance d (in cells), lift = max(0, 1 − d/radius), target height = .15 + idle waves + lift²·1.6, ease heights toward targets, write matrices (scale y = height, y = height/2) and lerp instance colour toward the accent by lift. Camera at an isometric-ish angle looking at the origin.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-instanced-grid.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.
- **Performance:** One draw call; per-frame matrix updates for ~1.3k instances. The pointer is raycast onto a plane.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-instanced-grid.tsx
```tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export interface ThreeInstancedGridProps {
  /** Columns × rows of pillars. */
  size?: number;
  color?: string;
  accent?: string;
  /** How far the cursor's influence reaches, in grid cells. */
  radius?: number;
  className?: string;
}

function Grid({ size, color, accent, radius }: Required<Omit<ThreeInstancedGridProps, "className">>) {
  const reduced = useReducedMotion();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = size * size;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const heights = useMemo(() => new Float32Array(count), [count]);
  const base = useMemo(() => new THREE.Color(color), [color]);
  const hot = useMemo(() => new THREE.Color(accent), [accent]);
  const tmp = useMemo(() => new THREE.Color(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hit = useMemo(() => new THREE.Vector3(999, 0, 999), []);
  const gap = 0.32;

  useFrame((s, dt) => {
    const m = mesh.current;
    if (!m) return;
    s.raycaster.setFromCamera(s.pointer, s.camera);
    if (!s.raycaster.ray.intersectPlane(plane, hit)) hit.set(999, 0, 999);
    const t = s.clock.elapsedTime;
    let i = 0;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++, i++) {
        const px = (x - size / 2) * gap, pz = (z - size / 2) * gap;
        const d = Math.hypot(px - hit.x, pz - hit.z) / gap;
        const lift = Math.max(0, 1 - d / radius);
        const idle = reduced ? 0 : (Math.sin(px * 1.4 + t) + Math.cos(pz * 1.2 + t * 0.8)) * 0.08;
        const target = 0.15 + idle + lift * lift * 1.6;
        // critically-damped-ish follow so pillars settle smoothly when the cursor leaves
        heights[i] = reduced ? target : heights[i] + (target - heights[i]) * Math.min(1, dt * 8);
        dummy.position.set(px, heights[i] / 2, pz);
        dummy.scale.set(1, heights[i], 1);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        m.setColorAt(i, tmp.copy(base).lerp(hot, Math.min(1, lift * 1.4)));
      }
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[gap * 0.82, 1, gap * 0.82]} />
      <meshStandardMaterial roughness={0.35} metalness={0.2} />
    </instancedMesh>
  );
}

/** A field of instanced pillars that rise and glow under the cursor and breathe at rest — thousands of boxes, one draw call. */
export function ThreeInstancedGrid({ size = 36, color = "#27272a", accent = "#a3e635", radius = 4, className }: ThreeInstancedGridProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [6, 7, 6], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 8, 2]} intensity={2.2} />
      <group rotation={[0, 0, 0]}>
        <Grid size={size} color={color} accent={accent} radius={radius} />
      </group>
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
      </Environment>
      <CameraAim />
    </Canvas3DShell>
  );
}

function CameraAim() {
  useFrame(({ camera }) => camera.lookAt(0, 0, 0));
  return null;
}
```

## Usage example
```tsx
"use client";
import { ThreeInstancedGrid } from "@/components/kinetik/three-instanced-grid";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[#09090b] text-white">
      <ThreeInstancedGrid />
      <div className="pointer-events-none absolute left-6 top-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-lime-300">1,296 pillars · 1 draw call</p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight">Hover the field</h3>
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
