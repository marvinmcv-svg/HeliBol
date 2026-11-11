You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# 3D Coin Flip (`three-coin`)

A metallic coin with canvas-drawn embossed faces. It flips on a spring with a little hop and tilts toward the pointer — fintech/rewards hero.

## What it should do
Build a 3D coin: cylinderGeometry(1.25, 1.25, .16, 96) rotated so its cap faces the camera, with three materials (edge metal, front and back faces using CanvasTextures drawn with a radial gradient, rim ring, ridges and a label). Flip: add 3π to a target and integrate a damped spring toward it each frame plus a sin-curve hop. Tilt with the pointer. Light with drei Environment Lightformers.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/three-coin.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/canvas-3d-shell.json
```

## Non-negotiables
- **Accessibility:** Decorative; announce results in HTML (demo uses aria-live). Reduced motion: flips snap to the final face.
- **Performance:** CanvasTexture faces generated once; one cylinder with three material groups.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/three-coin.tsx
```tsx
"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/kinetik/core";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

export interface ThreeCoinProps {
  /** Short mark embossed on the front face (1–3 characters read best). */
  front?: string;
  /** Text on the back face. */
  back?: string;
  color?: string;
  className?: string;
  /** Increment to flip the coin (e.g. from a button). */
  flipKey?: number;
}

/** Draws a face into a canvas texture: rim ring, ridged edge marks and the label. */
function faceTexture(label: string, base: string, small: boolean) {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const col = new THREE.Color(base);
  const dark = `#${col.clone().multiplyScalar(0.55).getHexString()}`;
  const light = `#${col.clone().lerp(new THREE.Color("#fff"), 0.45).getHexString()}`;
  const grad = g.createRadialGradient(size * 0.35, size * 0.3, 10, size / 2, size / 2, size / 2);
  grad.addColorStop(0, light);
  grad.addColorStop(1, `#${col.getHexString()}`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  g.strokeStyle = dark;
  g.lineWidth = 10;
  g.beginPath();
  g.arc(size / 2, size / 2, size * 0.41, 0, Math.PI * 2);
  g.stroke();
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    g.beginPath();
    g.moveTo(size / 2 + Math.cos(a) * size * 0.44, size / 2 + Math.sin(a) * size * 0.44);
    g.lineTo(size / 2 + Math.cos(a) * size * 0.48, size / 2 + Math.sin(a) * size * 0.48);
    g.lineWidth = 4;
    g.stroke();
  }
  g.fillStyle = dark;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `800 ${small ? 64 : 200}px system-ui, sans-serif`;
  g.fillText(label, size / 2, size / 2 + (small ? 0 : 10));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function Coin({ front, back, color, flipKey }: Required<Omit<ThreeCoinProps, "className">>) {
  const reduced = useReducedMotion();
  const mesh = useRef<THREE.Mesh>(null);
  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: 0.28 });
    const f = new THREE.MeshStandardMaterial({ map: faceTexture(front, color, false), metalness: 0.9, roughness: 0.3 });
    const b = new THREE.MeshStandardMaterial({ map: faceTexture(back, color, true), metalness: 0.9, roughness: 0.3 });
    return [edge, f, b];
  }, [front, back, color]);
  useEffect(() => () => materials.forEach((m) => { m.map?.dispose(); m.dispose(); }), [materials]);

  // Flip = add half-turns to a target and spring toward it; a little hop sells the toss.
  const anim = useRef({ target: 0, current: 0, vel: 0, hop: 0 });
  useEffect(() => {
    if (!flipKey) return;
    anim.current.target += Math.PI * 3;
    anim.current.hop = 1;
  }, [flipKey]);

  useFrame((s, dt) => {
    const m = mesh.current;
    if (!m) return;
    const a = anim.current;
    if (reduced) { a.current = a.target; a.vel = 0; a.hop = 0; }
    a.vel += (a.target - a.current) * 60 * dt;
    a.vel *= Math.exp(-9 * dt);
    a.current += a.vel * dt;
    a.hop = Math.max(0, a.hop - dt * 1.6);
    m.rotation.x = Math.PI / 2 + a.current + s.pointer.y * 0.25;
    m.rotation.z = -s.pointer.x * 0.5 + (reduced ? 0 : Math.sin(s.clock.elapsedTime * 0.8) * 0.15);
    m.position.y = Math.sin(a.hop * Math.PI) * 0.9;
  });

  return (
    <mesh ref={mesh} material={materials} rotation={[Math.PI / 2, 0, 0]}>
      {/* CylinderGeometry groups: 0 = side, 1 = top, 2 = bottom */}
      <cylinderGeometry args={[1.25, 1.25, 0.16, 96]} />
    </mesh>
  );
}

/** A metallic 3D coin with canvas-drawn embossed faces. It flips with a spring and a hop, and tilts toward the pointer. */
export function ThreeCoin({ front = "K", back = "KINETIK · 2026", color = "#d4a017", className, flipKey = 0 }: ThreeCoinProps) {
  return (
    <Canvas3DShell className={className} camera={{ position: [0, 0, 5], fov: 40 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <Coin front={front} back={back} color={color} flipKey={flipKey} />
      <Environment resolution={256}>
        <Lightformer intensity={5} position={[0, 5, -3]} scale={[10, 2, 1]} />
        <Lightformer intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer intensity={2} color="#fde68a" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
    </Canvas3DShell>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { ThreeCoin } from "@/components/kinetik/three-coin";

export default function Demo() {
  const [flips, setFlips] = useState(0);
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_40%,#292524,#0c0a09_70%)] text-white">
      <ThreeCoin flipKey={flips} />
      <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-2">
        <button onClick={() => setFlips((f) => f + 1)} className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black shadow-[0_8px_30px_-6px_rgb(251_191_36/.6)] transition active:scale-95">Flip the coin</button>
        <span className="text-xs text-white/50" aria-live="polite">{flips ? `Flipped ${flips}×` : "Earn rewards on every trade"}</span>
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
