You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Wave Terrain (`three-wave-terrain`)

A rolling field of points displaced on the GPU, with a ripple that follows the cursor across the ground plane — press to amplify. Depth fog dissolves the horizon.

## What it should do
Build a GPU wave terrain: a grid of points (resolution²) at y=0 rendered with a ShaderMaterial. Vertex shader sums a few sin/cos waves of x, z and time, adds a ripple exp(−d²·.35)·sin(3d − 4t) around uPointer, sets gl_PointSize by depth. Fragment discards outside a circle and fogs by depth. Each frame raycast the pointer onto Plane(y=0) and lerp uPointer to the hit; pointerdown raises uPress.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-wave-terrain.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Canvas is decorative (keep meaningful copy in HTML). Under reduced motion the shell switches to an on-demand frameloop and renders one still frame.
- **Performance:** ~20k points, all motion in the vertex shader; the pointer is raycast onto a math plane (no mesh raycasting).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-wave-terrain.tsx
```tsx
"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export interface ThreeWaveTerrainProps {
  /** Points per side of the grid. */
  resolution?: number;
  size?: number;
  color?: string;
  /** Background/fog colour so the far edge dissolves. */
  fog?: string;
  className?: string;
}

const vertexShader = /* glsl */ `
uniform float uTime; uniform vec2 uPointer; uniform float uPress;
varying float vH;
void main(){
  vec3 p = position;
  float h = sin(p.x * .6 + uTime) * .25 + cos(p.z * .8 + uTime * .7) * .25 + sin((p.x + p.z) * .35 + uTime * .5) * .35;
  float d = distance(p.xz, uPointer);
  h += exp(-d * d * .35) * (.9 + uPress) * sin(d * 3. - uTime * 4.) ;
  p.y += h;
  vH = h;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_PointSize = 2.2 * (8. / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const fragmentShader = /* glsl */ `
uniform vec3 uColor; uniform vec3 uFog; varying float vH;
void main(){
  float r = length(gl_PointCoord - .5); if (r > .5) discard;
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float f = smoothstep(4., 14., depth);
  vec3 c = uColor * (.55 + vH * .6);
  gl_FragColor = vec4(mix(c, uFog, f), 1. - f * .9);
}`;

function Terrain({ resolution, size, color, fog }: Required<Omit<ThreeWaveTerrainProps, "className">>) {
  const reduced = useReducedMotion();
  const positions = useMemo(() => {
    const arr = new Float32Array(resolution * resolution * 3);
    for (let i = 0; i < resolution; i++)
      for (let j = 0; j < resolution; j++) arr.set([(i / resolution - 0.5) * size, 0, (j / resolution - 0.5) * size], (i * resolution + j) * 3);
    return arr;
  }, [resolution, size]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPointer: { value: new THREE.Vector2(0, 0) }, uPress: { value: 0 }, uColor: { value: new THREE.Color(color) }, uFog: { value: new THREE.Color(fog) } }), [color, fog]);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const press = useRef(0);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const el = gl.domElement;
    const down = () => (press.current = 1.2);
    const up = () => (press.current = 0);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => { el.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up); };
  }, [gl]);

  useFrame((s, dt) => {
    if (reduced) return;
    uniforms.uTime.value += dt;
    // Project the pointer onto the ground plane so the ripple sits under the cursor.
    s.raycaster.setFromCamera(s.pointer, s.camera);
    if (s.raycaster.ray.intersectPlane(plane, hit)) uniforms.uPointer.value.lerp(new THREE.Vector2(hit.x, hit.z), 0.08);
    uniforms.uPress.value += (press.current - uniforms.uPress.value) * 0.1;
  });

  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} />
    </points>
  );
}

/** A rolling field of points (GPU-displaced in a vertex shader) with a ripple that follows the cursor; press to amplify. */
export function ThreeWaveTerrain({ resolution = 140, size = 18, color = "#5eead4", fog = "#020617", className }: ThreeWaveTerrainProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 2.6, 6.5], fov: 50 }}>
      <group rotation={[-0.08, 0, 0]}>
        <Terrain resolution={resolution} size={size} color={color} fog={fog} />
      </group>
    </Canvas3DShell>
  );
}
```

## Usage example
```tsx
"use client";
import { ThreeWaveTerrain } from "@/components/kinetik/three-wave-terrain";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[#020617] text-white">
      <ThreeWaveTerrain />
      <div className="pointer-events-none absolute inset-x-0 top-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-teal-300/80">Signal field</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Data that breathes.</h3>
        <p className="mt-1 text-sm text-white/50">Move to ripple · press to amplify</p>
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
