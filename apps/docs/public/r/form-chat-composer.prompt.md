You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Form — Chat Composer (`form-chat-composer`)

Messaging composer with polish: the field grows with the text, attachments drop in as removable chips, the mic morphs into a send arrow as soon as you type, and sent text lifts into the thread as a bubble, followed by a typing reply.

## What it should do
Auto-size the textarea from scrollHeight; keep attachments as AnimatePresence chips; swap the mic/send icon by key with a rotating scale; append bubbles that rise from the composer origin with layout.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/form-chat-composer.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Thread is role=log aria-live; Enter sends, Shift+Enter breaks lines; all buttons labelled. Reduced motion fades.
- **Performance:** Layout animations on bubbles only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/form-chat-composer.tsx
```tsx
"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Mic, Paperclip, X } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ChatMessage { id: number; text: string; me: boolean }
export interface FormChatComposerProps {
  initial?: ChatMessage[];
  placeholder?: string;
  onSend?: (text: string, files: string[]) => void;
  className?: string;
}

/**
 * Messaging composer with polish: the field grows with the text, attachments drop in as removable
 * chips, the mic button morphs into a send arrow as soon as you type, and on send the text lifts out
 * of the field and becomes a bubble in the thread above (shared layout), with a typing reply after.
 */
export function FormChatComposer({ initial = [], placeholder = "Message", onSend, className }: FormChatComposerProps) {
  const reduced = useReducedMotion();
  const [msgs, setMsgs] = useState<ChatMessage[]>(initial);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const id = useRef(1000);
  const ta = useRef<HTMLTextAreaElement>(null);
  const has = text.trim().length > 0 || files.length > 0;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 30 };

  const send = () => {
    if (!has) return;
    const n = ++id.current;
    setMsgs((m) => [...m, { id: n, text: text.trim() || `📎 ${files.join(", ")}`, me: true }]);
    onSend?.(text.trim(), files);
    setText("");
    setFiles([]);
    if (ta.current) ta.current.style.height = "";
    setTimeout(() => setTyping(true), 500);
    setTimeout(() => (setTyping(false), setMsgs((m) => [...m, { id: ++id.current, text: "Got it — on it 👍", me: false }])), 1900);
  };

  return (
    <div className={cn("flex h-[420px] w-[340px] flex-col overflow-hidden rounded-[28px] border bg-card shadow-xl", className)}>
      <div role="log" aria-live="polite" className="flex flex-1 flex-col justify-end gap-1.5 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.p
              key={m.id}
              layout
              initial={reduced ? { opacity: 0 } : m.me ? { opacity: 0, y: 40, scale: 0.9 } : { opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              transition={spring}
              style={{ originX: m.me ? 1 : 0, originY: 1 }}
              className={cn("max-w-[78%] rounded-2xl px-3.5 py-2 text-sm", m.me ? "self-end rounded-br-md bg-sky-500 text-white" : "self-start rounded-bl-md bg-muted")}
            >
              {m.text}
            </motion.p>
          ))}
          {typing && (
            <motion.div key="typing" layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex gap-1 self-start rounded-2xl rounded-bl-md bg-muted px-3.5 py-3" aria-label="Typing">
              {[0, 1, 2].map((i) => <motion.span key={i} className="size-1.5 rounded-full bg-muted-foreground" animate={reduced ? {} : { y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <form onSubmit={(e) => (e.preventDefault(), send())} className="border-t p-3">
        <AnimatePresence initial={false}>
          {files.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap gap-1.5 pb-2">
                <AnimatePresence>
                  {files.map((f) => (
                    <motion.span key={f} layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} className="inline-flex items-center gap-1 rounded-full bg-muted py-1 pl-2.5 pr-1 text-xs">
                      📎 {f}
                      <button type="button" aria-label={`Remove ${f}`} onClick={() => setFiles((x) => x.filter((y) => y !== f))} className="grid size-4 place-items-center rounded-full hover:bg-foreground/10"><X className="size-3" /></button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-end gap-2">
          <button type="button" aria-label="Attach a file" onClick={() => setFiles((x) => [...x, ["brief.pdf", "moodboard.png", "notes.md", "budget.xlsx"][x.length % 4]!].filter((v, i, a) => a.indexOf(v) === i))} className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted">
            <Paperclip className="size-4" />
          </button>
          <textarea
            ref={ta}
            rows={1}
            value={text}
            placeholder={placeholder}
            aria-label="Message"
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(120, e.target.scrollHeight)}px`;
            }}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            className="max-h-[120px] min-h-9 flex-1 resize-none rounded-[18px] border bg-background px-3.5 py-2 text-sm leading-5 outline-none transition-[height] focus:ring-2 focus:ring-ring"
          />
          <motion.button type={has ? "submit" : "button"} aria-label={has ? "Send" : "Record voice message"} animate={{ backgroundColor: has ? "#0ea5e9" : "rgba(0,0,0,0)", color: has ? "#fff" : "currentColor" }} className="relative grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={has ? "send" : "mic"} initial={{ scale: 0, rotate: reduced ? 0 : -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: reduced ? 0 : 90 }} transition={spring}>
                {has ? <ArrowUp className="size-4" /> : <Mic className="size-4" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </form>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { FormChatComposer } from "@/components/kinetik/form-chat-composer";

export default function Demo() {
  return (
    <DemoCenter>
      <FormChatComposer
        initial={[
          { id: 1, text: "Hey! Did the new hero land?", me: false },
          { id: 2, text: "Yes — shipping it tonight 🚀", me: true },
          { id: 3, text: "Send me the brief when you can", me: false },
        ]}
      />
    </DemoCenter>
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
