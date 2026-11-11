"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapFlairTrailProps {
  children?: ReactNode;
  /** Sprites to spawn (emoji, text, or any node rendered once and cloned). */
  flair?: string[];
  /** Minimum pointer travel (px) between spawns. */
  spacing?: number;
  className?: string;
}

/**
 * Pointer "flair": every few pixels of travel a sprite pops out at the cursor, flies in the
 * direction you're moving, spins and drops with a gravity-like ease, then is removed.
 */
export function GsapFlairTrail({ children, flair = ["✦", "★", "●", "◆", "✿"], spacing = 36, className }: GsapFlairTrailProps) {
  const root = useRef<HTMLDivElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const n = useRef(0);
  const reduced = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: root });

  const onMove = contextSafe((e: React.PointerEvent) => {
    if (reduced) return;
    const box = root.current!.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const prev = last.current;
    if (prev && Math.hypot(x - prev.x, y - prev.y) < spacing) return;
    const dx = prev ? x - prev.x : 0;
    const dy = prev ? y - prev.y : 0;
    last.current = { x, y };
    const el = document.createElement("span");
    el.textContent = flair[n.current++ % flair.length];
    el.setAttribute("aria-hidden", "true");
    el.className = "pointer-events-none absolute left-0 top-0 select-none text-2xl";
    el.style.color = `hsl(${(n.current * 37) % 360} 90% 65%)`;
    root.current!.appendChild(el);
    gsap
      .timeline({ onComplete: () => el.remove() })
      .set(el, { x, y, xPercent: -50, yPercent: -50, scale: 0, rotation: gsap.utils.random(-90, 90) })
      .to(el, { scale: gsap.utils.random(0.8, 1.4), duration: 0.25, ease: "back.out(3)" })
      .to(el, { x: x + dx * 2.5, duration: 1.2, ease: "power2.out" }, 0)
      .to(el, { y: y + dy * 1.5 + 140, duration: 1.2, ease: "power2.in" }, 0)
      .to(el, { rotation: `+=${gsap.utils.random(-360, 360)}`, duration: 1.2, ease: "none" }, 0)
      .to(el, { opacity: 0, scale: 0.4, duration: 0.4 }, 0.8);
  });

  return (
    <div ref={root} onPointerMove={onMove} onPointerLeave={() => (last.current = null)} className={cn("relative overflow-hidden", className)}>
      {children}
    </div>
  );
}
