You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# 3D Canvas Shell (`canvas-3d-shell`)

A production-ready React Three Fiber canvas: clamped DPR, pauses off-screen and in background tabs, reduced-motion aware, lazy-loadable.

## What it should do
Create a reusable R3F canvas shell: `<Canvas dpr={[1, 2]}>` whose `frameloop` is "always" only while an IntersectionObserver says it's on screen, the document is visible and reduced motion is off ("demand" otherwise), wrapped in Suspense. Demo: a floating, distorted (MeshDistortMaterial) violet torus knot that tilts toward the pointer, lit by a directional light, a cyan point light and a local Lightformer environment (no HDR download). Import the shell with next/dynamic (ssr: false).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/canvas-3d-shell.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Canvas is decorative — keep meaningful content in HTML. Reduced motion: renders a still frame.
- **Performance:** frameloop switches to 'demand' when off-screen/hidden; DPR clamped to 2. Always lazy-load (next/dynamic, ssr:false).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/canvas-3d-shell.tsx
```tsx
"use client";
import { Suspense, useRef, useState, useEffect, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { cn, usePageVisible, useReducedMotion } from "@/lib/kinetik/core";

export interface Canvas3DShellProps {
  children: ReactNode;
  className?: string;
  /** Max device pixel ratio (clamped for performance). */
  maxDpr?: number;
  camera?: { position?: [number, number, number]; fov?: number };
  fallback?: ReactNode;
}

/**
 * Production wrapper for React Three Fiber: lazy-mountable, DPR clamped, renders only while
 * on-screen and the tab is visible ("demand" frameloop otherwise), static under reduced motion.
 * Load it with next/dynamic or React.lazy so three.js never lands in your main bundle.
 */
export function Canvas3DShell({ children, className, maxDpr = 2, camera = { position: [0, 0, 5], fov: 45 }, fallback }: Canvas3DShellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const visible = usePageVisible();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const active = onScreen && visible && !reduced;
  return (
    <div ref={ref} className={cn("relative h-full w-full", className)}>
      <Suspense fallback={fallback ?? null}>
        <Canvas dpr={[1, maxDpr]} camera={camera} frameloop={active ? "always" : "demand"} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";
import { Canvas3DShell } from "@/components/kinetik/canvas-3d-shell";

function Blob() {
  const mesh = useRef<Mesh>(null);
  useFrame((state, dt) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += dt * 0.25;
    mesh.current.rotation.x = state.pointer.y * 0.4;
    mesh.current.rotation.z = state.pointer.x * 0.3;
  });
  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={mesh} scale={1.45}>
        <torusKnotGeometry args={[0.9, 0.32, 220, 32]} />
        <MeshDistortMaterial color="#8b5cf6" roughness={0.15} metalness={0.4} distort={0.28} speed={2} />
      </mesh>
    </Float>
  );
}

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_40%,rgb(139_92_246/.25),transparent_60%)]">
      <Canvas3DShell>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <pointLight position={[-4, -2, -2]} intensity={30} color="#22d3ee" />
        <Blob />
        {/* Local studio lighting — no HDR download */}
        <Environment resolution={256}>
          <Lightformer intensity={4} position={[0, 4, -6]} scale={[10, 4, 1]} />
          <Lightformer intensity={2} color="#a78bfa" position={[-5, 0, -2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
          <Lightformer intensity={2} color="#22d3ee" position={[5, -1, 0]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        </Environment>
      </Canvas3DShell>
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs backdrop-blur">Move your pointer · renders only while on screen</p>
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
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
