"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ButtonParticleDissolveProps {
  children: ReactNode;
  /** Resolve when the action succeeds; the button stays dissolved into its success state. */
  onAction?: () => Promise<void> | void;
  doneLabel?: string;
  /** Particle colour; defaults to the button's background. */
  color?: string;
  className?: string;
}

/**
 * On click the button disintegrates: it's sampled into ~600 particles on a canvas that drift away
 * like sand in the wind (left to right sweep), then a success pill springs in where it stood.
 */
export function ButtonParticleDissolve({ children, onAction, doneLabel = "Sent", color, className }: ButtonParticleDissolveProps) {
  const reduced = useReducedMotion();
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "dissolving" | "done">("idle");

  const run = async () => {
    if (phase !== "idle") return;
    await onAction?.();
    if (reduced) return setPhase("done");
    setPhase("dissolving");
  };

  useEffect(() => {
    if (phase !== "dissolving") return;
    const b = btn.current, c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!b || !c || !ctx) return setPhase("done");
    const r = b.getBoundingClientRect();
    const pad = 120;
    const dpr = Math.min(2, devicePixelRatio || 1);
    c.width = (r.width + pad * 2) * dpr;
    c.height = (r.height + pad * 2) * dpr;
    c.style.width = `${r.width + pad * 2}px`;
    c.style.height = `${r.height + pad * 2}px`;
    ctx.scale(dpr, dpr);
    const fill = color ?? getComputedStyle(b).backgroundColor;
    const radius = r.height / 2;
    // sample points inside the pill shape
    const parts: { x: number; y: number; vx: number; vy: number; delay: number; life: number; s: number }[] = [];
    for (let i = 0; i < 650; i++) {
      const x = Math.random() * r.width, y = Math.random() * r.height;
      const cx = Math.min(Math.max(x, radius), r.width - radius);
      if (Math.hypot(x - cx, y - radius) > radius) continue;
      parts.push({ x: x + pad, y: y + pad, vx: 0, vy: 0, delay: (x / r.width) * 0.45 + Math.random() * 0.12, life: 1, s: 1 + Math.random() * 2.2 });
    }
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = fill;
      let alive = 0;
      for (const p of parts) {
        if (t > p.delay) {
          p.vx += 0.18 + Math.random() * 0.12;
          p.vy += (Math.random() - 0.62) * 0.35;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.018;
        }
        if (p.life <= 0) continue;
        alive++;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      if (alive && t < 3) raf = requestAnimationFrame(frame);
      else setPhase("done");
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase, color]);

  return (
    <span className={cn("relative inline-grid place-items-center", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {phase === "done" ? (
          <motion.span
            key="done"
            role="status"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring.bouncy}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-semibold text-white"
          >
            <Check className="size-4" strokeWidth={3} /> {doneLabel}
          </motion.span>
        ) : (
          <button
            key="btn"
            ref={btn}
            type="button"
            onClick={run}
            disabled={phase === "dissolving"}
            className={cn("inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", phase === "dissolving" && "opacity-0")}
          >
            {children}
          </button>
        )}
      </AnimatePresence>
      {phase === "dissolving" && <canvas ref={canvas} aria-hidden className="pointer-events-none absolute" style={{ left: -120, top: -120 }} />}
    </span>
  );
}
