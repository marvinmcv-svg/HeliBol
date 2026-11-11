You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Shader on Scroll (`gsap-shader-scroll`)

A full-screen fragment shader (raw WebGL) whose uniforms are scrubbed by ScrollTrigger: scrolling twists and zooms an fbm noise field and crossfades the palette panel by panel.

## What it should do
Build a scroll-driven shader section: a sticky canvas with a raw WebGL fullscreen triangle running an fbm domain-warp fragment shader (uniforms uTime, uProgress, uA, uB). A ScrollTrigger (scrub) tweens a progress object; progress rotates/zooms the noise domain and picks/lerps palette pairs per panel. Render with rAF only while visible.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap`
- Put the component at `components/kinetik/gsap-shader-scroll.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Canvas aria-hidden; text panels are real HTML. Reduced motion: time stops, scroll still changes the palette. CSS gradient fallback without WebGL.
- **Performance:** One fullscreen triangle; DPR capped at 1.5; rAF pauses off-screen; context released on unmount.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-shader-scroll.tsx
```tsx
"use client";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(ScrollTrigger);

export interface GsapShaderScrollProps {
  /** Text panels shown as you scroll; the shader morphs across them. */
  panels: ReactNode[];
  /** One colour pair per panel: [deep, bright]. */
  palettes?: [string, string][];
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uProgress;
uniform vec3 uA; uniform vec3 uB;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes; vec2 p=(uv-.5)*vec2(uRes.x/uRes.y,1.);
  // scroll progress twists and zooms the domain; time keeps it alive
  float t=uTime*.08+uProgress*3.;
  float ang=uProgress*2.2; p*=mat2(cos(ang),-sin(ang),sin(ang),cos(ang));
  p*=1.6+uProgress*1.4;
  vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));
  float f=fbm(p+2.*q);
  vec3 col=mix(uA,uB,smoothstep(.25,.85,f));
  col+=pow(f,4.)*.6;
  col*=1.-.35*length(uv-.5);
  gl_FragColor=vec4(col,1.);
}`;
const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const hex = (c: string) => {
  const v = parseInt(c.replace("#", ""), 16);
  return [(v >> 16) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
};

const DEFAULT_PALETTES: [string, string][] = [["#1e1b4b", "#a78bfa"], ["#042f2e", "#5eead4"], ["#431407", "#fb923c"], ["#4a044e", "#f0abfc"]];

/**
 * A full-screen fragment shader (raw WebGL, ~1 KB) whose uniforms are scrubbed by ScrollTrigger:
 * scrolling twists and zooms the noise field and crossfades the palette panel by panel. Time keeps
 * it gently moving. Reduced motion: no time animation, palette still follows scroll.
 */
export function GsapShaderScroll({ panels, palettes = DEFAULT_PALETTES, scroller, className }: GsapShaderScrollProps) {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current, sec = section.current;
    const gl = c?.getContext("webgl", { antialias: false, alpha: false });
    if (!c || !sec || !gl) return; // no WebGL: the CSS gradient fallback stays visible
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uProg = u("uProgress"), uA = u("uA"), uB = u("uB");

    const cols = palettes.map(([a, b]) => [hex(a), hex(b)]);
    const state = { progress: 0 };
    const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      gl.viewport(0, 0, c.width, c.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    let raf = 0, visible = true;
    const start = performance.now();
    const draw = () => {
      const seg = state.progress * (cols.length - 1);
      const i = Math.min(cols.length - 2, Math.floor(seg)), f = seg - i;
      gl.uniform2f(uRes, c.width, c.height);
      gl.uniform1f(uTime, reduced ? 0 : (performance.now() - start) / 1000);
      gl.uniform1f(uProg, state.progress);
      gl.uniform3fv(uA, mix(cols[i][0], cols[i + 1][0], f));
      gl.uniform3fv(uB, mix(cols[i][1], cols[i + 1][1], f));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => { draw(); raf = visible && !reduced ? requestAnimationFrame(loop) : 0; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && !reduced) loop(); });
    io.observe(sec);

    const st = ScrollTrigger.create({
      trigger: sec,
      scroller: scroller?.current ?? undefined,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        gsap.to(state, { progress: self.progress, duration: 0.6, ease: "power2.out", overwrite: true, onUpdate: () => reduced && draw() });
      },
    });
    loop();
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); st.kill(); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, [palettes, reduced, scroller]);

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: `${panels.length * 100}cqh` }}>
      <canvas ref={canvas} aria-hidden className="sticky top-0 block h-[100cqh] w-full bg-[linear-gradient(135deg,#1e1b4b,#7c3aed)]" />
      <div className="absolute inset-0">
        {panels.map((p, i) => (
          <div key={i} className="grid h-[100cqh] place-items-center p-8 text-center text-white">{p}</div>
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
import { GsapShaderScroll } from "@/components/kinetik/gsap-shader-scroll";

const panel = (k: string, t: string) => (
  <div>
    <p className="text-[10px] uppercase tracking-[0.35em] opacity-70">{k}</p>
    <h3 className="mt-2 text-4xl font-semibold tracking-tight [text-shadow:0_2px_30px_rgb(0_0_0/.4)]">{t}</h3>
  </div>
);

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return <GsapShaderScroll scroller={s} panels={[panel("01 · Dream", "Ideas start as noise."), panel("02 · Shape", "Give them direction."), panel("03 · Ship", "Turn heat into product."), panel("04 · Repeat", "Then do it again.")]} />;
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.35}>
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
