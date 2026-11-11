"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface GsapVelocitySkewProps {
  children: ReactNode;
  /** Scroll container (defaults to window). */
  scroller?: RefObject<HTMLElement | null>;
  /** Max skew in degrees. */
  max?: number;
  className?: string;
}

/**
 * Items marked `data-skew` lean with scroll speed: ScrollTrigger's getVelocity() → clamped skewY,
 * applied with a quickSetter and eased back to 0 when scrolling stops. Only the bigger
 * velocity wins, so it never jitters.
 */
export function GsapVelocitySkew({ children, scroller, max = 14, className }: GsapVelocitySkewProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const targets = root.current!.querySelectorAll("[data-skew]");
      const proxy = { skew: 0 };
      const set = gsap.quickSetter(targets, "skewY", "deg");
      const clamp = gsap.utils.clamp(-max, max);
      ScrollTrigger.create({
        trigger: root.current,
        scroller: scroller?.current ?? undefined,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const s = clamp(self.getVelocity() / -250);
          if (Math.abs(s) > Math.abs(proxy.skew)) {
            proxy.skew = s;
            gsap.to(proxy, { skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => set(proxy.skew) });
          }
        },
      });
      gsap.set(targets, { transformOrigin: "center center", force3D: true });
    },
    { scope: root, dependencies: [reduced, max] },
  );

  return (
    <div ref={root} className={cn(className)}>
      {children}
    </div>
  );
}
