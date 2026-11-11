"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface GsapBatchRevealProps {
  children: ReactNode;
  scroller?: RefObject<HTMLElement | null>;
  /** Max items animated together per batch. */
  batchMax?: number;
  className?: string;
}

/**
 * ScrollTrigger.batch(): items marked `data-batch` that enter the viewport in the same tick are
 * grouped and staggered together, so a fast scroll reveals a whole row at once instead of a
 * long queue. Items fade back out when scrolled past upward, and come back in again.
 */
export function GsapBatchReveal({ children, scroller, batchMax = 6, className }: GsapBatchRevealProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const items = root.current!.querySelectorAll("[data-batch]");
      if (reduced) {
        gsap.set(items, { autoAlpha: 1 });
        return;
      }
      gsap.set(items, { autoAlpha: 0, y: 60, scale: 0.94 });
      ScrollTrigger.batch(items, {
        scroller: scroller?.current ?? undefined,
        batchMax,
        start: "top 92%",
        onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.7, ease: "power3.out", overwrite: true }),
        onLeaveBack: (b) => gsap.to(b, { autoAlpha: 0, y: 60, scale: 0.94, stagger: 0.04, duration: 0.4, overwrite: true }),
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className={cn(className)}>
      {children}
    </div>
  );
}
