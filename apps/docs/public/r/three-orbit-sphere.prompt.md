You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Orbit Sphere (`three-orbit-sphere`)

A dotted planet with tilted orbit rings and satellites — the classic "global network / coverage" hero visual.

## What it should do
Build an orbit sphere hero in React Three Fiber: a Fibonacci-sphere Points cloud over a dark occluding sphere, plus several tilted ring groups (thin torus + N small spheres on the circle, first one larger in an accent colour). Rotate each ring group around its own axis at alternating speeds, spin the whole rig slowly and ease its X tilt toward the pointer.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-orbit-sphere.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.
- **Performance:** ~2.4k points plus a few dozen tiny spheres; ring groups rotate as wholes.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-orbit-sphere.tsx
```tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export interface ThreeOrbitSphereProps {
  /** Dots on the core sphere. */
  dots?: number;
  /** Orbiting satellites per ring; one entry per ring. */
  rings?: number[];
  color?: string;
  accent?: string;
  className?: string;
}

const DEFAULT_RINGS = [5, 8, 12];

function Scene({ dots, rings, color, accent }: Required<Omit<ThreeOrbitSphereProps, "className">>) {
  const reduced = useReducedMotion();
  const root = useRef<THREE.Group>(null);
  const ringRefs = useRef<(THREE.Group | null)[]>([]);
  const sphere = useMemo(() => {
    const arr = new Float32Array(dots * 3);
    for (let i = 0; i < dots; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / dots);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      arr.set(new THREE.Vector3().setFromSphericalCoords(1.2, phi, theta).toArray(), i * 3);
    }
    return arr;
  }, [dots]);
  // Each ring: radius, tilt, speed — tilted planes read as "orbits" instead of flat circles.
  const ringDefs = useMemo(() => rings.map((n, i) => ({ n, r: 1.65 + i * 0.42, tilt: [0.5 + i * 0.35, i * 0.8, 0.2 * i] as [number, number, number], speed: (i % 2 ? -1 : 1) * (0.5 - i * 0.1) })), [rings]);

  useFrame((s, dt) => {
    if (reduced) return;
    ringRefs.current.forEach((g, i) => g && (g.rotation.z += dt * ringDefs[i].speed));
    const r = root.current;
    if (r) {
      r.rotation.y += dt * 0.12;
      r.rotation.x += (s.pointer.y * 0.5 - r.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={root}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[sphere, 3]} /></bufferGeometry>
        <pointsMaterial size={0.035} color={color} transparent opacity={0.85} sizeAttenuation depthWrite={false} />
      </points>
      <mesh><sphereGeometry args={[1.17, 48, 48]} /><meshBasicMaterial color="#000" transparent opacity={0.6} /></mesh>
      {ringDefs.map((d, i) => (
        <group key={i} rotation={d.tilt}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[d.r, 0.003, 8, 160]} />
            <meshBasicMaterial color={color} transparent opacity={0.25} />
          </mesh>
          <group ref={(g) => { ringRefs.current[i] = g; }}>
            {Array.from({ length: d.n }, (_, k) => {
              const a = (k / d.n) * Math.PI * 2;
              return (
                <mesh key={k} position={[Math.cos(a) * d.r, Math.sin(a) * d.r, 0]}>
                  <sphereGeometry args={[k === 0 ? 0.07 : 0.035, 16, 16]} />
                  <meshBasicMaterial color={k === 0 ? accent : color} />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}
    </group>
  );
}

/** A dotted planet with tilted orbit rings and satellites — the "network / coverage" hero visual. */
export function ThreeOrbitSphere({ dots = 2400, rings = DEFAULT_RINGS, color = "#e4e4e7", accent = "#f97316", className }: ThreeOrbitSphereProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 6.2], fov: 45 }}>
      <Scene dots={dots} rings={rings} color={color} accent={accent} />
    </Canvas3DShell>
  );
}
```

## Usage example
```tsx
"use client";
import { ThreeOrbitSphere } from "@/components/kinetik/three-orbit-sphere";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_50%,#1c1917,#0a0a0a_70%)] text-white">
      <ThreeOrbitSphere />
      <div className="pointer-events-none absolute left-6 top-6 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-orange-400">Live coverage</p>
        <p className="text-4xl font-semibold tabular-nums tracking-tight">312<span className="text-white/40"> nodes</span></p>
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
