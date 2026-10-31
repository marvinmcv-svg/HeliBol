"use client";
import { useRef, type ButtonHTMLAttributes } from "react";
import { cn, prefersReducedMotion } from "@kinetik/core";

export interface ButtonEmojiBurstProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  emojis?: string[];
  count?: number;
}

/** Every click sprays emoji particles from the cursor that arc, spin and fall (lightweight DOM physics). */
export function ButtonEmojiBurst({ emojis = ["🎉", "✨", "💜", "🚀", "⭐"], count = 14, className, onClick, ...props }: ButtonEmojiBurstProps) {
  const layer = useRef<HTMLSpanElement>(null);
  const burst = (x: number, y: number) => {
    if (prefersReducedMotion() || !layer.current) return;
    const host = layer.current;
    const parts = Array.from({ length: count }, () => {
      const el = document.createElement("span");
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = "position:fixed;left:0;top:0;pointer-events:none;font-size:18px;will-change:transform;z-index:60";
      host.appendChild(el);
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      const sp = 260 + Math.random() * 320;
      return { el, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 0, vr: (Math.random() - 0.5) * 720, life: 0 };
    });
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      let alive = 0;
      for (const p of parts) {
        p.life += dt;
        if (p.life > 1.3) {
          p.el.remove();
          continue;
        }
        alive++;
        p.vy += 900 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += p.vr * dt;
        p.el.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.r}deg) scale(${1 - p.life / 1.6})`;
        p.el.style.opacity = String(Math.min(1, 1.3 - p.life));
      }
      if (alive) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  return (
    <button
      {...props}
      onClick={(e) => {
        onClick?.(e);
        const r = e.currentTarget.getBoundingClientRect();
        burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
      }}
      className={cn("inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <span ref={layer} aria-hidden />
      {props.children}
    </button>
  );
}
