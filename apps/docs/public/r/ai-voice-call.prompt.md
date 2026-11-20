You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# AI — Voice Call (`ai-voice-call`)

Voice-assistant call screen: a liquid orb that breathes while listening, swirls while thinking and pulses with the voice while speaking, live word-by-word captions, a call timer, mute and hang-up.

## What it should do
State machine listening → thinking → speaking over a script; orb = layered blurred gradients whose scale/rotation depend on state; captions reveal word by word; a timer; mute toggles and hang-up ends the call.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/ai-voice-call.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Captions are an aria-live region; state is announced; controls are labelled buttons. Reduced motion keeps the orb static and shows full captions.
- **Performance:** Orb animates transform/opacity only; captions reveal one word per tick.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/ai-voice-call.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface VoiceTurn {
  who: "user" | "agent";
  text: string;
}

export interface AiVoiceCallProps {
  /** Scripted conversation for the demo; wire your real transcript stream instead. */
  turns: VoiceTurn[];
  agentName?: string;
  className?: string;
}

/**
 * Voice-agent call screen: a living orb that breathes while listening and ripples with energy while
 * the agent speaks, live captions that type in word by word, a call timer, mute and hang-up. States:
 * listening → thinking (orb contracts, shimmer) → speaking.
 */
export function AiVoiceCall({ turns, agentName = "Nova", className }: AiVoiceCallProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [words, setWords] = useState(0);
  const [phase, setPhase] = useState<"listening" | "thinking" | "speaking">("listening");
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [secs, setSecs] = useState(0);
  const turn = turns[i % turns.length];
  const total = turn.text.split(" ").length;

  useEffect(() => {
    if (ended) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [ended]);
  useEffect(() => {
    if (ended) return;
    if (words < total) {
      const id = setTimeout(() => setWords((w) => w + 1), reduced ? 0 : 140);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      const nextTurn = turns[(i + 1) % turns.length];
      if (nextTurn.who === "agent") {
        setPhase("thinking");
        setTimeout(() => (setPhase("speaking"), setI((n) => n + 1), setWords(0)), 900);
      } else {
        setPhase("listening");
        setI((n) => n + 1);
        setWords(0);
      }
    }, 1200);
    return () => clearTimeout(id);
  }, [words, total, i, turns, ended, reduced]);
  useEffect(() => setPhase(turn.who === "agent" ? "speaking" : "listening"), [i]); // eslint-disable-line react-hooks/exhaustive-deps

  const speaking = phase === "speaking" && !ended;
  return (
    <div className={cn("relative flex h-full w-full max-w-sm flex-col items-center overflow-hidden rounded-[2rem] bg-zinc-950 p-6 text-white", className)}>
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">{ended ? "Call ended" : phase}</p>
      <p className="mt-1 font-mono text-sm tabular-nums text-white/60">{String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}</p>
      <div className="relative my-6 grid size-44 place-items-center" aria-hidden>
        {[0, 1, 2].map((k) => (
          <motion.span
            key={k}
            className="absolute inset-0 rounded-full border border-violet-400/40"
            animate={speaking && !reduced ? { scale: [1, 1.5 + k * 0.15], opacity: [0.6, 0] } : { scale: 1, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: k * 0.5, ease: "easeOut" }}
          />
        ))}
        <motion.span
          className="size-32 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f5d0fe,#a855f7_45%,#4c1d95)] shadow-[0_0_80px_-10px_rgb(168_85_247/.8)]"
          animate={
            reduced || ended
              ? { scale: 1 }
              : phase === "thinking"
                ? { scale: [0.9, 0.85, 0.9], filter: ["hue-rotate(0deg)", "hue-rotate(40deg)", "hue-rotate(0deg)"] }
                : speaking
                  ? { scale: [1, 1.08, 0.97, 1.05, 1], borderRadius: ["50%", "46% 54% 52% 48%", "52% 48% 46% 54%", "50%"] }
                  : { scale: [1, 1.03, 1] }
          }
          transition={{ duration: phase === "speaking" ? 1.1 : 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="min-h-24 w-full text-center" aria-live="polite">
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">{turn.who === "agent" ? agentName : "You"}</p>
        <p className={cn("mt-1 text-lg leading-snug", turn.who === "agent" ? "text-white" : "text-white/70")}>
          <AnimatePresence initial={false}>
            {turn.text.split(" ").slice(0, words).map((w, k) => (
              <motion.span key={`${i}-${k}`} initial={reduced ? false : { opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} className="inline-block whitespace-pre">{w} </motion.span>
            ))}
          </AnimatePresence>
        </p>
      </div>
      <div className="mt-auto flex gap-6 pt-6">
        <button type="button" onClick={() => setMuted((m) => !m)} aria-pressed={muted} aria-label={muted ? "Unmute" : "Mute"} className={cn("grid size-14 place-items-center rounded-full transition-colors", muted ? "bg-white text-black" : "bg-white/10 hover:bg-white/20")}>
          {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
        </button>
        <button type="button" onClick={() => setEnded(true)} aria-label="End call" className="grid size-14 place-items-center rounded-full bg-rose-500 hover:bg-rose-600"><PhoneOff className="size-5" /></button>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { AiVoiceCall } from "@/components/kinetik/ai-voice-call";

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-4">
      <AiVoiceCall
        className="h-[460px]"
        turns={[
          { who: "agent", text: "Hi! I'm Nova. What can I help you plan today?" },
          { who: "user", text: "Book a table for four on Friday, somewhere quiet." },
          { who: "agent", text: "Done — Lumen at 7:30, corner booth, away from the bar. Want a reminder?" },
          { who: "user", text: "Yes, an hour before please." },
        ]}
      />
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
