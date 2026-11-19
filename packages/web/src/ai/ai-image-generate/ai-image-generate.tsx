"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface AiImageGenerateProps {
  /** Final image URL ("generated" result). */
  image: string;
  prompt: string;
  /** Seconds the fake diffusion takes. */
  duration?: number;
  /** Increment to regenerate. */
  runKey?: number;
  className?: string;
}

/**
 * Diffusion-style generation preview: the frame starts as coloured noise, a scanning light sweeps
 * down while the image resolves from heavy blur + pixelation + noise to sharp, a step counter and
 * progress ring tick up, and the prompt types out underneath. Replace the timer with your real
 * progress events.
 */
export function AiImageGenerate({ image, prompt, duration = 4.5, runKey = 0, className }: AiImageGenerateProps) {
  const reduced = useReducedMotion();
  const [p, setP] = useState(reduced ? 1 : 0);
  const noise = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return setP(1);
    setP(0);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const v = Math.min(1, (now - t0) / 1000 / duration);
      setP(v);
      const c = noise.current;
      const ctx = c?.getContext("2d");
      if (c && ctx && v < 1) {
        const img = ctx.createImageData(c.width, c.height);
        for (let i = 0; i < img.data.length; i += 4) {
          const n = Math.random() * 255;
          img.data[i] = n * (0.6 + Math.random() * 0.4);
          img.data[i + 1] = n * 0.5;
          img.data[i + 2] = n;
          img.data[i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
      }
      if (v < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [runKey, duration, reduced]);

  const e = 1 - (1 - p) ** 2.4; // ease-out progress for the visuals
  const steps = Math.round(p * 30);
  const done = p >= 1;
  const typed = prompt.slice(0, Math.ceil(Math.min(1, p * 3) * prompt.length));

  return (
    <figure className={cn("w-full max-w-sm", className)}>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl">
        <img
          src={image}
          alt={done ? prompt : ""}
          className="absolute inset-0 size-full object-cover"
          style={{ filter: `blur(${(1 - e) * 28}px) saturate(${0.4 + e * 0.6}) contrast(${1.3 - e * 0.3})`, transform: `scale(${1.15 - e * 0.15})` }}
        />
        <canvas ref={noise} width={64} height={64} aria-hidden className="absolute inset-0 size-full [image-rendering:pixelated] mix-blend-overlay" style={{ opacity: Math.max(0, 1 - e * 1.3) * 0.9 }} />
        {!done && !reduced && (
          <motion.span aria-hidden className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-white/25 to-transparent" animate={{ top: ["-25%", "110%"] }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }} />
        )}
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur" aria-live="polite">
          <svg viewBox="0 0 20 20" className="size-4 -rotate-90" aria-hidden>
            <circle cx="10" cy="10" r="8" fill="none" stroke="rgb(255 255 255 / .25)" strokeWidth="2.5" />
            <circle cx="10" cy="10" r="8" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
          </svg>
          {done ? "Done" : `Step ${steps}/30`}
        </div>
        <AnimatePresence>
          {done && !reduced && <motion.span aria-hidden initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-white" />}
        </AnimatePresence>
      </div>
      <figcaption className="mt-3 flex items-start gap-2 text-sm">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-violet-400" />
        <span className="text-muted-foreground">
          {typed}
          {!done && <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-current align-middle motion-reduce:animate-none" />}
        </span>
      </figcaption>
    </figure>
  );
}
