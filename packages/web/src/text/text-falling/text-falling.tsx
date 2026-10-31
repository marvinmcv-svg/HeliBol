"use client";
import { useRef, useState, type ElementType } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TextFallingProps {
  children: string;
  as?: ElementType;
  gravity?: number;
  className?: string;
}

/** Click and the letters drop with gravity, bounce on the floor and tumble — click again to restore. */
export function TextFalling({ children, as: Tag = "div", gravity = 2400, className }: TextFallingProps) {
  const box = useRef<HTMLElement>(null);
  const [fallen, setFallen] = useState(false);
  const raf = useRef(0);
  const reduced = useReducedMotion();

  const drop = () => {
    const el = box.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    const spans = [...el.querySelectorAll<HTMLElement>("[data-ch]")];
    if (fallen || reduced) {
      spans.forEach((s) => {
        s.style.transition = "translate .6s cubic-bezier(.34,1.56,.64,1), rotate .6s";
        s.style.translate = "0 0";
        s.style.rotate = "0deg";
      });
      setFallen(false);
      return;
    }
    const floor = el.getBoundingClientRect().bottom;
    const bodies = spans.map((s) => {
      s.style.transition = "none";
      const r = s.getBoundingClientRect();
      return { s, y: 0, vy: -200 - Math.random() * 300, x: 0, vx: (Math.random() - 0.5) * 260, rot: 0, vr: (Math.random() - 0.5) * 600, max: floor - r.bottom };
    });
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      let moving = false;
      for (const b of bodies) {
        b.vy += gravity * dt;
        b.y += b.vy * dt;
        b.x += b.vx * dt;
        b.rot += b.vr * dt;
        if (b.y > b.max) {
          b.y = b.max;
          b.vy *= -0.38;
          b.vx *= 0.7;
          b.vr *= 0.6;
        }
        if (Math.abs(b.vy) > 12 || b.y < b.max - 1) moving = true;
        b.s.style.translate = `${b.x.toFixed(1)}px ${b.y.toFixed(1)}px`;
        b.s.style.rotate = `${b.rot.toFixed(1)}deg`;
      }
      if (moving) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    setFallen(true);
  };

  return (
    <Tag ref={box} className={cn("relative h-full w-full", className)}>
      <button onClick={drop} aria-label={`${children} — ${fallen ? "restore letters" : "drop letters"}`} className="cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {Array.from(children).map((ch, i) => (
          <span key={i} data-ch aria-hidden className="inline-block whitespace-pre will-change-transform">
            {ch}
          </span>
        ))}
      </button>
    </Tag>
  );
}
