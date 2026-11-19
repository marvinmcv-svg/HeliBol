You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Water Caustics (`bg-caustics`)

Pool-floor caustics in a ~1 KB fragment shader: iterated light focusing in two layers, a deep-to-shallow gradient and a ripple that follows the pointer.

## What it should do
Build a caustics background with raw WebGL: fullscreen triangle; fragment shader computes the classic iterated caustic (5 iterations of trig feedback) at two scales, adds a pointer ripple sin(d·40 − 4t)·e^(−6d) to the UVs, mixes a deep→shallow gradient and adds the light colour. rAF only while visible.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **canvas**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-caustics.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative canvas behind real content. Reduced motion: one still frame. CSS gradient fallback without WebGL.
- **Performance:** Fullscreen triangle, DPR ≤ 1.5, paused off-screen and in background tabs.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-caustics.tsx
```tsx
"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface BgCausticsProps {
  children?: ReactNode;
  /** Deep water colour. */
  deep?: string;
  /** Light colour of the caustic lines. */
  light?: string;
  speed?: number;
  className?: string;
}

const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uPointer; uniform vec3 uDeep; uniform vec3 uLight;
// classic iterated caustic: light focusing through a moving water surface
float caustic(vec2 uv, float t){
  vec2 p = mod(uv * 6.2831, 6.2831) - 250.0;
  vec2 i = p; float c = 1.0; float inten = .005;
  for (int n = 0; n < 5; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 5.0; c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.0);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes; vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec2 q = uv * asp * .55;
  // ripple pushed by the pointer
  float d = distance(uv * asp, uPointer * asp);
  q += .02 * sin(d * 40.0 - uTime * 4.0) * exp(-d * 6.0);
  float c = caustic(q, uTime * .5) + .5 * caustic(q * 1.7 + .3, uTime * .35);
  vec3 col = mix(uDeep, uDeep * 1.6, uv.y);
  col += uLight * clamp(c, 0.0, 1.2) * .8;
  col *= .85 + .15 * smoothstep(1.2, .2, length((uv - .5) * asp));
  gl_FragColor = vec4(col, 1.0);
}`;
const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const hex = (c: string) => { const v = parseInt(c.slice(1), 16); return [(v >> 16) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]; };

/**
 * Pool-floor caustics in a ~1 KB fragment shader: iterated light focusing in two layers, a deep-to-
 * shallow gradient, and a ripple that follows the pointer. Pauses off-screen; reduced motion
 * renders one still frame. Falls back to a CSS gradient without WebGL.
 */
export function BgCaustics({ children, deep = "#04364a", light = "#a5f3fc", speed = 1, className }: BgCausticsProps) {
  const reduced = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    const gl = c?.getContext("webgl", { antialias: false });
    if (!c || !gl) return;
    const sh = (t: number, s: string) => { const x = gl.createShader(t)!; gl.shaderSource(x, s); gl.compileShader(x); return x; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, "p");
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform3fv(u("uDeep"), hex(deep));
    gl.uniform3fv(u("uLight"), hex(light));
    const pointer = [0.5, 0.5], target = [0.5, 0.5];
    const resize = () => {
      const dpr = Math.min(1.5, devicePixelRatio || 1);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      gl.viewport(0, 0, c.width, c.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    resize();
    const host = c.parentElement!;
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); target[0] = (e.clientX - r.left) / r.width; target[1] = 1 - (e.clientY - r.top) / r.height; };
    host.addEventListener("pointermove", move);
    let raf = 0, visible = true;
    const t0 = performance.now();
    const draw = () => {
      pointer[0] += (target[0] - pointer[0]) * 0.08;
      pointer[1] += (target[1] - pointer[1]) * 0.08;
      gl.uniform2f(u("uRes"), c.width, c.height);
      gl.uniform1f(u("uTime"), reduced ? 3 : ((performance.now() - t0) / 1000) * speed);
      gl.uniform2f(u("uPointer"), pointer[0], pointer[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => { draw(); raf = visible && !reduced && !document.hidden ? requestAnimationFrame(loop) : 0; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) loop(); });
    io.observe(c);
    loop();
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); host.removeEventListener("pointermove", move); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, [deep, light, speed, reduced]);

  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={{ background: `linear-gradient(to top, ${deep}, #0e7490)` }}>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 -z-10 size-full" />
      {children}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { BgCaustics } from "@/components/kinetik/bg-caustics";

export default function Demo() {
  return (
    <BgCaustics className="grid h-full place-items-center text-white">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-100/80">Summer house · Algarve</p>
        <h3 className="mt-2 text-4xl font-semibold tracking-tight [text-shadow:0_2px_24px_rgb(0_0_0/.35)] sm:text-5xl">Dive in slowly.</h3>
      </div>
    </BgCaustics>
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
