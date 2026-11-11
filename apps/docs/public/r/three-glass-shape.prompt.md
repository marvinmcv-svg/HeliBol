You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Glass Shape (`three-glass-shape`)

A refracting glass object (drei MeshTransmissionMaterial) floating in front of coloured shapes — real refraction, chromatic dispersion, faceted or smooth cut — tilting toward the pointer.

## What it should do
Build a glass hero object with React Three Fiber + drei MeshTransmissionMaterial (thickness 1.4, ior 1.35, chromaticAberration, backside, samples 6). Put bright coloured primitives behind it so refraction is visible, wrap it in drei Float, rotate slowly and ease rotation toward the pointer. Offer faceted (flatShading, low detail) vs smooth. Light it with drei Environment + Lightformers (no HDR download). Cap DPR at 1.75.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-glass-shape.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame. Temporal distortion is turned off.
- **Performance:** Transmission renders the scene twice; DPR capped at 1.75 and resolution 512. Use one glass object per page.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-glass-shape.tsx
```tsx
"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import type { Mesh } from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export type GlassGeometry = "icosahedron" | "torus" | "knot" | "octahedron";

export interface ThreeGlassShapeProps {
  geometry?: GlassGeometry;
  /** Faceted (flat-shaded, low-poly) or smooth glass. */
  faceted?: boolean;
  /** Colour cast inside the glass. */
  tint?: string;
  /** Chromatic aberration strength (0–1). */
  dispersion?: number;
  className?: string;
}

function Shape({ geometry, faceted, tint, dispersion }: Required<Omit<ThreeGlassShapeProps, "className">>) {
  const reduced = useReducedMotion();
  const mesh = useRef<Mesh>(null);
  useFrame((s, dt) => {
    const m = mesh.current;
    if (!m || reduced) return;
    m.rotation.y += dt * 0.3;
    m.rotation.x += (s.pointer.y * 0.6 - m.rotation.x) * 0.04;
    m.rotation.z += (-s.pointer.x * 0.4 - m.rotation.z) * 0.04;
  });
  const detail = faceted ? 0 : 12;
  return (
    <Float speed={reduced ? 0 : 1.4} floatIntensity={0.8} rotationIntensity={0.3}>
      <mesh ref={mesh} scale={1.3}>
        {geometry === "icosahedron" && <icosahedronGeometry args={[1.1, faceted ? 0 : 8]} />}
        {geometry === "octahedron" && <octahedronGeometry args={[1.2, detail ? 6 : 0]} />}
        {geometry === "torus" && <torusGeometry args={[0.85, 0.36, faceted ? 8 : 64, faceted ? 16 : 128]} />}
        {geometry === "knot" && <torusKnotGeometry args={[0.75, 0.26, faceted ? 64 : 220, faceted ? 6 : 32]} />}
        <MeshTransmissionMaterial
          flatShading={faceted}
          color={tint}
          thickness={1.4}
          roughness={0.02}
          ior={1.35}
          chromaticAberration={dispersion}
          anisotropicBlur={0.2}
          distortion={0.15}
          distortionScale={0.4}
          temporalDistortion={reduced ? 0 : 0.08}
          backside
          samples={6}
          resolution={512}
        />
      </mesh>
    </Float>
  );
}

/** Colourful shapes stay behind the glass so the refraction has something to bend. */
function Backdrop() {
  return (
    <group position={[0, 0, -2.4]}>
      <mesh position={[-1.6, 0.6, 0]}><sphereGeometry args={[0.7, 32, 32]} /><meshBasicMaterial color="#f472b6" /></mesh>
      <mesh position={[1.7, -0.5, 0]}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#22d3ee" /></mesh>
      <mesh position={[0.2, 1.4, -0.5]} rotation={[0.4, 0.2, 0]}><torusGeometry args={[0.5, 0.18, 16, 48]} /><meshBasicMaterial color="#facc15" /></mesh>
      <mesh position={[0, -1.5, -0.3]}><planeGeometry args={[6, 0.25]} /><meshBasicMaterial color="#a78bfa" /></mesh>
    </group>
  );
}

/**
 * A refracting glass object (MeshTransmissionMaterial) floating in front of coloured shapes:
 * real-time refraction, chromatic dispersion and a faceted or smooth cut. Pointer tilts it.
 */
export function ThreeGlassShape({ geometry = "icosahedron", faceted = true, tint = "#ffffff", dispersion = 0.6, className }: ThreeGlassShapeProps) {
  return (
    <Canvas3DShell className={className} maxDpr={1.75} camera={{ position: [0, 0, 5], fov: 42 }}>
      <Backdrop />
      <Shape geometry={geometry} faceted={faceted} tint={tint} dispersion={dispersion} />
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 4, -4]} scale={[10, 3, 1]} />
        <Lightformer intensity={3} color="#c4b5fd" position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer intensity={3} color="#67e8f9" position={[5, 0, 0]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
      </Environment>
    </Canvas3DShell>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { ThreeGlassShape, type GlassGeometry } from "@/components/kinetik/three-glass-shape";

const shapes: GlassGeometry[] = ["icosahedron", "knot", "torus", "octahedron"];

export default function Demo() {
  const [shape, setShape] = useState<GlassGeometry>("icosahedron");
  const [faceted, setFaceted] = useState(true);
  return (
    <div className="relative h-full w-full bg-[#0b0a12] text-white">
      <ThreeGlassShape geometry={shape} faceted={faceted} />
      <div className="absolute inset-x-0 bottom-4 flex flex-wrap justify-center gap-1.5 px-4 text-xs">
        {shapes.map((s) => (
          <button key={s} onClick={() => setShape(s)} className={`rounded-full border px-3 py-1 capitalize backdrop-blur ${s === shape ? "border-white bg-white text-black" : "border-white/20 bg-white/5"}`}>{s}</button>
        ))}
        <button onClick={() => setFaceted((f) => !f)} aria-pressed={faceted} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 backdrop-blur">{faceted ? "Faceted" : "Smooth"}</button>
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
