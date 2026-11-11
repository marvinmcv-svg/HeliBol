"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(Physics2DPlugin, useGSAP);

export interface GsapConfettiCannonProps {
  children: ReactNode;
  /** Pieces per burst. */
  count?: number;
  colors?: string[];
  /** Launch angle in degrees (−90 = straight up). */
  angle?: number;
  /** Cone width in degrees. */
  spread?: number;
  className?: string;
  onFire?: () => void;
}

const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#22d3ee", "#10b981", "#f43f5e"];

/**
 * Wraps a button: clicking fires real projectile confetti from it. Each piece gets a
 * Physics2D velocity/angle/gravity (so it arcs and falls naturally), plus independent
 * 3D flips and a fade, and is removed when it lands.
 */
export function GsapConfettiCannon({ children, count = 60, colors = COLORS, angle = -90, spread = 70, className, onFire }: GsapConfettiCannonProps) {
  const root = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: root });

  const fire = contextSafe(() => {
    onFire?.();
    if (reduced) return;
    const host = root.current!;
    const r = host.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const el = document.createElement("i");
      el.setAttribute("aria-hidden", "true");
      const w = gsap.utils.random(6, 11);
      Object.assign(el.style, {
        position: "absolute",
        left: `${r.width / 2}px`,
        top: `${r.height / 2}px`,
        width: `${w}px`,
        height: `${w * gsap.utils.random(0.4, 1.6)}px`,
        background: colors[i % colors.length],
        borderRadius: i % 3 === 0 ? "50%" : "2px",
        pointerEvents: "none",
        zIndex: "50",
      });
      host.appendChild(el);
      gsap
        .timeline({ onComplete: () => el.remove() })
        .to(el, {
          physics2D: { velocity: gsap.utils.random(320, 640), angle: angle + gsap.utils.random(-spread / 2, spread / 2), gravity: 900, friction: 0.03 },
          duration: 2.2,
        })
        .to(el, { rotationX: gsap.utils.random(360, 1080), rotationY: gsap.utils.random(-720, 720), rotation: gsap.utils.random(-360, 360), duration: 2.2, ease: "none" }, 0)
        .to(el, { opacity: 0, duration: 0.5 }, 1.6);
    }
    gsap.fromTo(host.firstElementChild, { scale: 0.9 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" });
  });

  return (
    <span ref={root} onClick={fire} className={cn("relative inline-block", className)}>
      {children}
    </span>
  );
}
