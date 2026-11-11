You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Sphere Gallery (`three-sphere-gallery`)

Photos tiled over a sphere (Fibonacci lattice, each tile facing outward) that you grab and spin with inertia, settling back into a slow idle rotation.

## What it should do
Build a draggable 3D sphere gallery in React Three Fiber. Place N planes on a Fibonacci sphere; orient each with Matrix4.lookAt so its front faces outward. Load images with drei useTexture (sRGB). Listen to pointerdown/move/up on the canvas element: while dragging, set angular velocity from the pointer delta; when released, ease velocity back to an idle spin. Clamp the X tilt. Add fog so far tiles fade. Under reduced motion drop the idle spin.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-sphere-gallery.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Canvas is decorative — also provide the images as an HTML list or link grid. Drag uses pointer events (touch works, vertical page scroll preserved). Reduced motion: no idle spin.
- **Performance:** 48 textured planes, textures shared via useTexture; fog hides the back so overdraw is low.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-sphere-gallery.tsx
```tsx
"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export interface ThreeSphereGalleryProps {
  images: string[];
  /** How many tiles to place on the sphere (images repeat to fill). */
  tiles?: number;
  radius?: number;
  /** Idle spin in radians per second. */
  autoRotate?: number;
  className?: string;
}

function Gallery({ images, tiles, radius, autoRotate }: Required<Omit<ThreeSphereGalleryProps, "className">>) {
  const reduced = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const textures = useTexture(images);
  textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  const gl = useThree((s) => s.gl);

  // Fibonacci lattice → even spacing; each tile looks outward from the centre.
  const placements = useMemo(() => {
    const out: { pos: THREE.Vector3; quat: THREE.Quaternion; tex: number }[] = [];
    const m = new THREE.Matrix4();
    for (let i = 0; i < tiles; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / tiles);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const pos = new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
      m.lookAt(pos.clone().multiplyScalar(2), pos, new THREE.Vector3(0, 1, 0));
      out.push({ pos, quat: new THREE.Quaternion().setFromRotationMatrix(m), tex: i % images.length });
    }
    return out;
  }, [tiles, radius, images.length]);

  // Drag to spin with inertia — pointer events on the canvas element, so it works with touch too.
  const drag = useRef({ down: false, x: 0, y: 0, vx: 0, vy: 0 });
  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";
    const d = drag.current;
    const down = (e: PointerEvent) => { d.down = true; d.x = e.clientX; d.y = e.clientY; el.style.cursor = "grabbing"; };
    const move = (e: PointerEvent) => {
      if (!d.down) return;
      d.vx = (e.clientX - d.x) * 0.006; d.vy = (e.clientY - d.y) * 0.006; d.x = e.clientX; d.y = e.clientY;
    };
    const up = () => { d.down = false; el.style.cursor = "grab"; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { el.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [gl]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const d = drag.current;
    g.rotation.y += d.vx;
    g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.vy, -0.9, 0.9);
    if (!d.down) {
      // friction back toward the idle spin
      d.vx += ((reduced ? 0 : autoRotate) * dt - d.vx) * 0.04;
      d.vy *= 0.9;
    } else { d.vx *= 0.5; d.vy *= 0.5; }
  });

  const w = (radius * 2.6) / Math.sqrt(tiles);
  return (
    <group ref={group}>
      {placements.map((p, i) => (
        <mesh key={i} position={p.pos} quaternion={p.quat}>
          <planeGeometry args={[w * 1.25, w, 1, 1]} />
          <meshBasicMaterial map={textures[p.tex]} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Photos tiled over a sphere you can grab and spin, with inertia and a slow idle rotation. */
export function ThreeSphereGallery({ images, tiles = 48, radius = 2.2, autoRotate = 0.12, className }: ThreeSphereGalleryProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 6.4], fov: 45 }}>
      <fog attach="fog" args={["#05050a", 5, 9.5]} />
      <Gallery images={images} tiles={tiles} radius={radius} autoRotate={autoRotate} />
    </Canvas3DShell>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ThreeSphereGallery } from "@/components/kinetik/three-sphere-gallery";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[#05050a] text-white">
      <ThreeSphereGallery images={photos} />
      <div className="pointer-events-none absolute inset-x-0 top-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">Archive · 48 frames</p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight">Drag the world</h3>
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
