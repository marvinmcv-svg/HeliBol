You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hologram (`three-hologram`)

Sci-fi hologram: a fresnel-rim shader with scrolling scanlines, flicker and occasional horizontal glitch slices, additive-blended over a projector cone. Knot, head, ring or crystal.

## What it should do
Build a hologram in R3F: ShaderMaterial with vertex glitch (random horizontal offset for thin y-bands in brief bursts) and a fragment of fresnel × scanlines (fract(y·22 − t·1.6)) × flicker, additive blending, double-sided; add a ring and an open cone for the projector; slow spin with pointer tilt.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-hologram.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Canvas is decorative. Reduced motion: no glitch, still frame.
- **Performance:** One ShaderMaterial; additive, no depth write.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-hologram.tsx
```tsx
"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export type HologramShape = "knot" | "head" | "ring" | "crystal";

export interface ThreeHologramProps {
  shape?: HologramShape;
  color?: string;
  className?: string;
}

const vertexShader = /* glsl */ `
uniform float uTime; uniform float uGlitch;
varying vec3 vNormal; varying vec3 vView; varying vec3 vWorld;
float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec4 world = modelMatrix * vec4(position, 1.0);
  // glitch: horizontal slice displacement in short bursts
  float band = step(.985, rand(vec2(floor(world.y * 18.0), floor(uTime * 8.0))));
  world.x += band * (rand(vec2(uTime)) - .5) * .35 * uGlitch;
  vWorld = world.xyz;
  vec4 mv = viewMatrix * world;
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const fragmentShader = /* glsl */ `
uniform float uTime; uniform vec3 uColor;
varying vec3 vNormal; varying vec3 vView; varying vec3 vWorld;
void main(){
  float fres = pow(1.0 - abs(dot(vNormal, vView)), 2.0);
  float lines = step(.5, fract(vWorld.y * 22.0 - uTime * 1.6)) * .55 + .45;
  float flicker = .92 + .08 * sin(uTime * 37.0);
  float a = (fres * 1.25 + .08) * lines * flicker;
  gl_FragColor = vec4(uColor * (1.0 + fres), a);
}`;

function Holo({ shape, color }: { shape: HologramShape; color: string }) {
  const reduced = useReducedMotion();
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uGlitch: { value: reduced ? 0 : 1 }, uColor: { value: new THREE.Color(color) } }), [color, reduced]);
  useFrame((s, dt) => {
    if (reduced) return;
    uniforms.uTime.value += dt;
    if (mesh.current) {
      mesh.current.rotation.y += dt * 0.4;
      mesh.current.rotation.x += (s.pointer.y * 0.4 - mesh.current.rotation.x) * 0.05;
    }
  });
  return (
    <group>
      <mesh ref={mesh}>
        {shape === "knot" && <torusKnotGeometry args={[0.8, 0.26, 220, 32]} />}
        {shape === "head" && <sphereGeometry args={[1, 64, 64]} />}
        {shape === "ring" && <torusGeometry args={[0.9, 0.3, 48, 128]} />}
        {shape === "crystal" && <octahedronGeometry args={[1.15, 1]} />}
        <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      {/* projector base */}
      <mesh position={[0, -1.45, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.6, 0.75, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.75, 0]}>
        <coneGeometry args={[1.1, 1.4, 64, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/**
 * Sci-fi hologram: a fresnel-rim shader with scrolling scanlines, flicker and occasional horizontal
 * glitch slices, additive-blended over a projector cone. Pick a knot, head, ring or crystal.
 */
export function ThreeHologram({ shape = "knot", color = "#22d3ee", className }: ThreeHologramProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0.2, 4.4], fov: 45 }}>
      <Holo shape={shape} color={color} />
    </Canvas3DShell>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { ThreeHologram, type HologramShape } from "@/components/kinetik/three-hologram";

const shapes: HologramShape[] = ["knot", "head", "ring", "crystal"];

export default function Demo() {
  const [shape, setShape] = useState<HologramShape>("knot");
  return (
    <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_bottom,#0c2b36,#020608_70%)] text-cyan-100">
      <ThreeHologram shape={shape} />
      <div className="absolute left-5 top-5 font-mono text-[11px] uppercase tracking-widest text-cyan-300/80">Projection · {shape}</div>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
        {shapes.map((s) => (
          <button key={s} onClick={() => setShape(s)} aria-pressed={s === shape} className={`rounded-full border px-3 py-1 font-mono text-xs capitalize ${s === shape ? "border-cyan-300 bg-cyan-300/15" : "border-cyan-300/20 text-cyan-100/60"}`}>{s}</button>
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
