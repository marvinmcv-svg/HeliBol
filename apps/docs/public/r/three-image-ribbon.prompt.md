You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Image Ribbon (`three-image-ribbon`)

Photos wrapped on a tilted, genuinely curved ribbon (open cylinder slices) that drifts and spins faster with wheel or drag.

## What it should do
Build a curved image ribbon in React Three Fiber: for each image create an open CylinderGeometry slice (thetaStart = i·(arc+gap), thetaLength = arc) textured with that image, inside a group tilted on Z. Add wheel + drag velocity that decays back to an idle drift; ease the tilt with the pointer. Dispose geometries on unmount.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-image-ribbon.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Canvas is decorative — mirror the projects as HTML links. Wheel listener is passive so page scroll still works. Reduced motion: no drift.
- **Performance:** One cylinder slice per image; textures shared.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-image-ribbon.tsx
```tsx
"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export interface ThreeImageRibbonProps {
  images: string[];
  radius?: number;
  /** Panel height in world units. */
  height?: number;
  /** Idle drift, radians per second. */
  speed?: number;
  className?: string;
}

function Ribbon({ images, radius, height, speed }: Required<Omit<ThreeImageRibbonProps, "className">>) {
  const reduced = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const textures = useTexture(images);
  textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  const gl = useThree((s) => s.gl);
  const n = images.length;
  const gap = 0.04;
  const arc = (Math.PI * 2) / n - gap;
  // Open cylinder slices → each photo is genuinely curved, not a flat card on a circle.
  const geometries = useMemo(() => Array.from({ length: n }, (_, i) => new THREE.CylinderGeometry(radius, radius, height, 24, 1, true, i * (arc + gap), arc)), [n, radius, height, arc]);
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);

  // Wheel and drag add velocity; it decays back to the idle drift.
  const vel = useRef(0);
  useEffect(() => {
    const el = gl.domElement;
    let down = false, lastX = 0;
    const wheel = (e: WheelEvent) => { vel.current += (e.deltaY + e.deltaX) * 0.0004; };
    const pd = (e: PointerEvent) => { down = true; lastX = e.clientX; };
    const pm = (e: PointerEvent) => { if (down) { vel.current = (e.clientX - lastX) * 0.004; lastX = e.clientX; } };
    const pu = () => (down = false);
    el.addEventListener("wheel", wheel, { passive: true });
    el.addEventListener("pointerdown", pd);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    el.style.cursor = "grab";
    return () => { el.removeEventListener("wheel", wheel); el.removeEventListener("pointerdown", pd); window.removeEventListener("pointermove", pm); window.removeEventListener("pointerup", pu); };
  }, [gl]);

  useFrame((s, dt) => {
    const g = group.current;
    if (!g) return;
    vel.current += ((reduced ? 0 : speed * dt) - vel.current) * 0.05;
    g.rotation.y += vel.current;
    g.rotation.z += ((reduced ? -0.12 : -0.12 + s.pointer.y * 0.06) - g.rotation.z) * 0.05;
  });

  return (
    <group ref={group} rotation={[0.05, 0, -0.12]}>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          {/* BackSide: we look at the inside of the ribbon from its centre-ish */}
          <meshBasicMaterial map={textures[i]} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Photos wrapped on a tilted, curved ribbon that drifts, and spins faster with wheel or drag — the video-ribbon portfolio look. */
export function ThreeImageRibbon({ images, radius = 2.4, height = 1.2, speed = 0.15, className }: ThreeImageRibbonProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0.4, 5.2], fov: 45 }}>
      <Ribbon images={images} radius={radius} height={height} speed={speed} />
    </Canvas3DShell>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ThreeImageRibbon } from "@/components/kinetik/three-image-ribbon";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[#f5f1ea] text-zinc-900">
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <h3 className="text-[clamp(3rem,12vw,8rem)] font-black uppercase leading-none tracking-tighter opacity-90">Selected</h3>
      </div>
      <ThreeImageRibbon images={photos} />
      <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs text-zinc-500">Scroll or drag to spin</p>
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
