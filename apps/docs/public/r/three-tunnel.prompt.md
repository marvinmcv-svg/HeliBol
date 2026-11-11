You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Warp Tunnel (`three-tunnel`)

An endless tunnel of glowing polygon rings (one InstancedMesh) streaming toward the camera; the far end bends toward the pointer.

## What it should do
Build a warp tunnel with a three.js InstancedMesh of thin tori (low radial segments make polygons). Each frame advance z modulo the spacing, position ring i at z = −i·spacing + offset, bend its x/y by steer·(depth fraction)² where steer lerps toward the pointer, spin slowly, and set an instance colour that brightens as rings approach. Black fog.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-tunnel.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.
- **Performance:** 80 instances in one draw call; matrices + colours updated per frame.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-tunnel.tsx
```tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export interface ThreeTunnelProps {
  /** Number of rings in the tunnel. */
  rings?: number;
  /** Forward speed in world units per second. */
  speed?: number;
  colors?: [string, string];
  /** Shape of each ring: smooth circle or polygon with this many sides (3–8). */
  sides?: number;
  className?: string;
}

function Tunnel({ rings, speed, colors, sides }: Required<Omit<ThreeTunnelProps, "className">>) {
  const reduced = useReducedMotion();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const spacing = 0.9;
  const depth = rings * spacing;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const palette = useMemo(() => {
    const a = new THREE.Color(colors[0]), b = new THREE.Color(colors[1]);
    return Array.from({ length: rings }, (_, i) => a.clone().lerp(b, (Math.sin(i * 0.35) + 1) / 2));
  }, [rings, colors]);
  const z = useRef(0);
  const steer = useRef(new THREE.Vector2());

  useFrame((s, dt) => {
    const m = mesh.current;
    if (!m) return;
    if (!reduced) z.current = (z.current + dt * speed) % spacing;
    steer.current.lerp(s.pointer, 0.04);
    for (let i = 0; i < rings; i++) {
      const pz = -i * spacing + z.current;
      // The tunnel bends with depth — the pointer steers where the far end points.
      const bend = (-pz / depth) ** 2;
      dummy.position.set(steer.current.x * bend * 6, steer.current.y * bend * 4, pz);
      dummy.rotation.set(0, 0, i * 0.12 + (reduced ? 0 : s.clock.elapsedTime * 0.2));
      const fade = 1 - Math.min(1, -pz / depth);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, palette[i].clone().multiplyScalar(0.25 + fade * 1.2));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, rings]}>
      <torusGeometry args={[2, 0.025, 6, sides >= 3 && sides <= 8 ? sides : 64]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

/** An endless warp tunnel of glowing rings (one InstancedMesh) that bends toward the pointer. */
export function ThreeTunnel({ rings = 80, speed = 3, colors = ["#f0abfc", "#38bdf8"], sides = 6, className }: ThreeTunnelProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 1.5], fov: 70 }}>
      <fog attach="fog" args={["#000", 10, 60]} />
      <Tunnel rings={rings} speed={speed} colors={colors} sides={sides} />
    </Canvas3DShell>
  );
}
```

## Usage example
```tsx
"use client";
import { ThreeTunnel } from "@/components/kinetik/three-tunnel";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-black text-white">
      <ThreeTunnel />
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-fuchsia-300">Entering</p>
          <h3 className="text-4xl font-black uppercase tracking-tight sm:text-6xl">Hyperspace</h3>
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
