You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scroll Camera Waypoints (`gsap-three-waypoints`)

A scroll-driven camera flight: a ScrollTrigger-scrubbed GSAP timeline tweens a plain object between waypoints and the R3F camera copies it each frame; captions crossfade per stop.

## What it should do
Build a scroll-driven three.js camera tour: a tall section with a sticky R3F Canvas. Keep a plain rig object {px,py,pz,tx,ty,tz}; a GSAP timeline with a scrub:1 ScrollTrigger tweens it from waypoint to waypoint (one unit each) and crossfades HTML captions. A CameraRig component copies rig → camera.position and lookAt in useFrame. Reduced motion: render the waypoints as static cards.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap three @react-three/fiber @react-three/drei`
- Put the component at `components/kinetik/gsap-three-waypoints.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Captions are real HTML. Reduced motion: no camera flight — every waypoint becomes a static card.
- **Performance:** Sticky canvas + scrub:1; the camera is only written in useFrame, GSAP never touches three.js objects directly.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-three-waypoints.tsx
```tsx
"use client";
import { useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(ScrollTrigger);

export interface Waypoint {
  title: string;
  body?: string;
  /** Camera position for this stop. */
  position: [number, number, number];
  /** Point the camera looks at. */
  target: [number, number, number];
}

export interface GsapThreeWaypointsProps {
  waypoints: Waypoint[];
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

/** Shared mutable camera state: GSAP tweens it, R3F reads it every frame. */
type Rig = { px: number; py: number; pz: number; tx: number; ty: number; tz: number };

function CameraRig({ rig }: { rig: Rig }) {
  const look = useRef(new THREE.Vector3());
  useFrame(({ camera }) => {
    camera.position.set(rig.px, rig.py, rig.pz);
    look.current.set(rig.tx, rig.ty, rig.tz);
    camera.lookAt(look.current);
  });
  return null;
}

/** A small "city" of blocks so each waypoint has something to frame. */
function Scene() {
  const blocks = Array.from({ length: 42 }, (_, i) => {
    const x = ((i % 7) - 3) * 1.6, z = (Math.floor(i / 7) - 3) * 1.6, h = 0.4 + ((i * 37) % 9) * 0.35;
    return { x, z, h, hot: i % 9 === 4 };
  });
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2}><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#111827" /></mesh>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[1, b.h, 1]} />
          <meshStandardMaterial color={b.hot ? "#f97316" : "#334155"} emissive={b.hot ? "#f97316" : "#000"} emissiveIntensity={b.hot ? 0.6 : 0} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 3.4, 0]}><torusKnotGeometry args={[0.6, 0.18, 160, 24]} /><meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.15} /></mesh>
    </group>
  );
}

/**
 * Scroll-driven camera flight: a GSAP timeline (scrubbed by ScrollTrigger) tweens a plain object
 * between waypoints; the R3F camera copies it every frame. Captions fade in per stop.
 */
export function GsapThreeWaypoints({ waypoints, scroller, className }: GsapThreeWaypointsProps) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const first = waypoints[0];
  const rig = useRef<Rig>({ px: first.position[0], py: first.position[1], pz: first.position[2], tx: first.target[0], ty: first.target[1], tz: first.target[2] });

  useEffect(() => {
    if (reduced || !section.current) return;
    const captions = section.current.querySelectorAll<HTMLElement>("[data-caption]");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: section.current, scroller: scroller?.current ?? undefined, start: "top top", end: "bottom bottom", scrub: 1 } });
      gsap.set(captions, { autoAlpha: 0, y: 30 });
      gsap.set(captions[0], { autoAlpha: 1, y: 0 });
      waypoints.slice(1).forEach((w, i) => {
        tl.to(rig.current, { px: w.position[0], py: w.position[1], pz: w.position[2], tx: w.target[0], ty: w.target[1], tz: w.target[2], duration: 1 }, i)
          .to(captions[i], { autoAlpha: 0, y: -30, duration: 0.3 }, i)
          .to(captions[i + 1], { autoAlpha: 1, y: 0, duration: 0.3 }, i + 0.7);
      });
    }, section);
    return () => ctx.revert();
  }, [reduced, scroller, waypoints]);

  if (reduced) {
    // No camera flight: each stop becomes a static card.
    return (
      <section className={cn("grid gap-4 p-6", className)}>
        {waypoints.map((w) => (
          <article key={w.title} className="rounded-2xl border border-border bg-card p-5"><h3 className="text-lg font-semibold">{w.title}</h3>{w.body && <p className="text-sm text-muted-foreground">{w.body}</p>}</article>
        ))}
      </section>
    );
  }

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: `${waypoints.length * 90}cqh` }}>
      <div className="sticky top-0 h-[100cqh] overflow-hidden bg-[#0b1120]">
        <Canvas dpr={[1, 1.75]} camera={{ fov: 45 }} gl={{ antialias: true }}>
          <fog attach="fog" args={["#0b1120", 8, 26]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 3]} intensity={2} />
          <Scene />
          <CameraRig rig={rig.current} />
          <Environment resolution={128}><Lightformer intensity={2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} /></Environment>
        </Canvas>
        {waypoints.map((w, i) => (
          <div key={w.title} data-caption className="pointer-events-none absolute bottom-8 left-6 max-w-xs text-white" style={{ visibility: i ? "hidden" : undefined }}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-300">Stop {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight">{w.title}</h3>
            {w.body && <p className="mt-1 text-sm text-white/60">{w.body}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapThreeWaypoints, type Waypoint } from "@/components/kinetik/gsap-three-waypoints";

const waypoints: Waypoint[] = [
  { title: "The district", body: "Scroll to fly the camera.", position: [9, 8, 9], target: [0, 0, 0] },
  { title: "Street level", body: "Low and fast between the blocks.", position: [-4.8, 1.2, 4], target: [0, 1, -2] },
  { title: "The landmark", body: "Orbit the centrepiece.", position: [2.2, 3.8, 2.2], target: [0, 3.4, 0] },
  { title: "Bird's eye", body: "Everything at once.", position: [0, 16, 0.01], target: [0, 0, 0] },
];

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return <GsapThreeWaypoints scroller={s} waypoints={waypoints} />;
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.15}>
      <Inner />
    </DemoScroller>
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
