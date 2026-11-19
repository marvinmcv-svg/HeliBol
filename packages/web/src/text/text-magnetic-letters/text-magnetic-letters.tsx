"use client";
import { useEffect, useRef } from "react";
import { cn, usePrefersTouch, useReducedMotion } from "@kinetik/core";

export interface TextMagneticLettersProps {
  text: string;
  /** Pixels within which letters react. */
  radius?: number;
  /** Positive pushes letters away from the pointer, negative pulls them in. */
  strength?: number;
  className?: string;
}

/**
 * Every letter is a tiny spring: near the cursor letters are pushed away (or pulled in), tilt and
 * gain weight, then spring back with a soft wobble when the cursor leaves. One rAF loop for all
 * letters, transforms only.
 */
export function TextMagneticLetters({ text, radius = 140, strength = 1, className }: TextMagneticLettersProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced || touch) return;
    const letters = [...el.querySelectorAll<HTMLSpanElement>("[data-l]")];
    const st = letters.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, w: 0 }));
    let centers: { x: number; y: number }[] = [];
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;
    const measure = () => (centers = letters.map((l) => {
      const r = l.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }));
    const tick = () => {
      let moving = false;
      letters.forEach((l, i) => {
        const s = st[i];
        let tx = 0, ty = 0, tw = 0;
        if (pointer) {
          const dx = centers[i].x - pointer.x, dy = centers[i].y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < radius) {
            const f = (1 - d / radius) ** 2;
            tx = (dx / (d || 1)) * f * 28 * strength;
            ty = (dy / (d || 1)) * f * 28 * strength;
            tw = f;
          }
        }
        // spring toward target (stiffness .12, damping .78)
        s.vx = (s.vx + (tx - s.x) * 0.12) * 0.78;
        s.vy = (s.vy + (ty - s.y) * 0.12) * 0.78;
        s.x += s.vx;
        s.y += s.vy;
        s.w += (tw - s.w) * 0.15;
        if (Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(tw - s.w) > 0.01) moving = true;
        l.style.transform = `translate(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px) rotate(${(s.x * 0.6).toFixed(2)}deg)`;
        l.style.fontVariationSettings = `"wght" ${Math.round(400 + s.w * 400)}`;
      });
      raf = moving || pointer ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      pointer = null;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    measure();
    const host = el.parentElement ?? el;
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [radius, strength, reduced, touch, text]);

  return (
    <span ref={root} aria-label={text} className={cn("inline-block", className)}>
      {[...text].map((ch, i) => (
        <span key={i} data-l aria-hidden className="inline-block will-change-transform" style={{ whiteSpace: "pre" }}>
          {ch}
        </span>
      ))}
    </span>
  );
}
