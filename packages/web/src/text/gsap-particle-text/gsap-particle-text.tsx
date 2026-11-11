"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapParticleTextProps {
  /** Words to cycle through. */
  words: string[];
  /** Seconds each word holds. */
  hold?: number;
  /** Sampling step in px (lower = more particles). */
  density?: number;
  colors?: string[];
  className?: string;
}

interface P {
  x: number;
  y: number;
  tx: number;
  ty: number;
  r: number;
  c: string;
  a: number;
}

const COLORS = ["#a78bfa", "#f0abfc", "#67e8f9", "#fcd34d", "#ffffff"];

/**
 * Particles assemble into a word, hold, scatter and re-form into the next one. Text is drawn
 * to an offscreen canvas and sampled into target points; GSAP tweens every particle's x/y with
 * a staggered expo ease (gsap.ticker draws one canvas). The pointer pushes particles away.
 */
export function GsapParticleText({ words, hold = 2.4, density = 5, colors = COLORS, className }: GsapParticleTextProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const parts = useRef<P[]>([]);
  const mouse = useRef<{ x: number; y: number } | null>(null);
  const [label, setLabel] = useState(words[0]);
  const reduced = useReducedMotion();

  const sample = (word: string, w: number, h: number) => {
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const ctx = off.getContext("2d");
    if (!ctx) return [] as { x: number; y: number }[];
    let size = Math.min(h * 0.55, (w * 1.6) / Math.max(4, word.length));
    ctx.font = `800 ${size}px system-ui, sans-serif`;
    while (ctx.measureText(word).width > w * 0.9 && size > 10) ctx.font = `800 ${(size -= 4)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(word, w / 2, h / 2);
    const data = ctx.getImageData(0, 0, w, h).data;
    const pts: { x: number; y: number }[] = [];
    for (let y = 0; y < h; y += density) for (let x = 0; x < w; x += density) if (data[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
    return pts;
  };

  useGSAP(
    () => {
      const c = canvas.current;
      const ctx = c?.getContext("2d");
      if (!c || !ctx) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = c.clientWidth;
      const h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let wi = 0;
      const form = (word: string, first: boolean) => {
        setLabel(word);
        const pts = gsap.utils.shuffle(sample(word, w, h));
        const ps = parts.current;
        while (ps.length < pts.length) ps.push({ x: Math.random() * w, y: Math.random() * h, tx: 0, ty: 0, r: gsap.utils.random(1, 2.2), c: gsap.utils.random(colors), a: 0 });
        ps.forEach((p, i) => {
          const t = pts[i % pts.length];
          const extra = i >= pts.length;
          p.tx = t.x + (extra ? gsap.utils.random(-2, 2) : 0);
          p.ty = t.y + (extra ? gsap.utils.random(-2, 2) : 0);
          if (reduced) Object.assign(p, { x: p.tx, y: p.ty, a: extra ? 0 : 1 });
        });
        if (reduced) return draw();
        gsap.to(ps, {
          x: (i: number) => ps[i].tx,
          y: (i: number) => ps[i].ty,
          a: (i: number) => (i >= pts.length ? 0 : 1),
          duration: first ? 1.6 : 1.3,
          ease: "expo.inOut",
          stagger: { amount: 0.6, from: "random" },
          overwrite: true,
        });
      };

      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        const m = mouse.current;
        for (const p of parts.current) {
          let { x, y } = p;
          if (m) {
            const dx = x - m.x;
            const dy = y - m.y;
            const d = Math.hypot(dx, dy);
            if (d < 70) {
              const f = (70 - d) / 70;
              x += (dx / (d || 1)) * f * 28;
              y += (dy / (d || 1)) * f * 28;
            }
          }
          ctx.globalAlpha = p.a;
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };

      form(words[0], true);
      if (reduced) return;
      gsap.ticker.add(draw);
      const cycle = gsap.delayedCall(hold + 1.6, function next() {
        wi = (wi + 1) % words.length;
        gsap.to(parts.current, { x: () => gsap.utils.random(0, w) as number, y: () => gsap.utils.random(0, h) as number, duration: 0.6, ease: "power2.in", stagger: { amount: 0.2, from: "random" }, onComplete: () => form(words[wi], false) });
        gsap.delayedCall(hold + 2, next);
      });
      return () => {
        gsap.ticker.remove(draw);
        cycle.kill();
      };
    },
    { scope: wrap, dependencies: [words.join("|"), reduced, density] },
  );

  useEffect(() => () => void (parts.current = []), []);

  return (
    <div
      ref={wrap}
      onPointerMove={(e) => {
        const r = canvas.current!.getBoundingClientRect();
        mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }}
      onPointerLeave={() => (mouse.current = null)}
      className={cn("relative", className)}
    >
      <canvas ref={canvas} aria-hidden className="h-full w-full" />
      <span className="sr-only" aria-live="polite">{label}</span>
    </div>
  );
}
