"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapTiltSceneProps {
  children: ReactNode;
  /** Max rotation in degrees. */
  max?: number;
  className?: string;
}

/**
 * The whole scene rotates in 3D toward the cursor (quickTo on rotationX/Y); children marked
 * `data-depth="1..5"` sit at translateZ steps so the layers separate as it tilts.
 */
export function GsapTiltScene({ children, max = 14, className }: GsapTiltSceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const q = useRef<{ rx: gsap.QuickToFunc; ry: gsap.QuickToFunc } | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      stage.current!.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => gsap.set(el, { z: Number(el.dataset.depth) * 30 }));
      if (reduced) return;
      q.current = {
        rx: gsap.quickTo(stage.current, "rotationX", { duration: 0.8, ease: "power3" }),
        ry: gsap.quickTo(stage.current, "rotationY", { duration: 0.8, ease: "power3" }),
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  const move = contextSafe((e: React.PointerEvent) => {
    if (!q.current || e.pointerType === "touch") return;
    const b = root.current!.getBoundingClientRect();
    const px = (e.clientX - b.left) / b.width - 0.5;
    const py = (e.clientY - b.top) / b.height - 0.5;
    q.current.ry(px * max * 2);
    q.current.rx(-py * max * 2);
  });

  const leave = contextSafe(() => {
    q.current?.rx(0);
    q.current?.ry(0);
  });

  return (
    <div ref={root} onPointerMove={move} onPointerLeave={leave} className={cn("[perspective:1100px]", className)}>
      <div ref={stage} className="relative h-full w-full [transform-style:preserve-3d]">
        {children}
      </div>
    </div>
  );
}
