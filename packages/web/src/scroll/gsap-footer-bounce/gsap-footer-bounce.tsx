"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface GsapFooterBounceProps {
  children: ReactNode;
  scroller?: RefObject<HTMLElement | null>;
  /** Fill colour of the footer (any CSS colour). */
  color?: string;
  className?: string;
}

/**
 * The footer's top edge is an SVG curve whose control point is pulled down by your scroll
 * speed as you arrive, then springs back with elastic.out — like the page landing on a
 * trampoline.
 */
export function GsapFooterBounce({ children, scroller, color = "var(--foreground)", className }: GsapFooterBounceProps) {
  const root = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const curve = { y: 0 };
      const render = () => path.current!.setAttribute("d", `M0,100 Q50,${100 - curve.y} 100,100 L100,100 L0,100 Z`);
      render();
      ScrollTrigger.create({
        trigger: root.current,
        scroller: scroller?.current ?? undefined,
        start: "top bottom",
        end: "bottom bottom",
        onUpdate(self) {
          const v = gsap.utils.clamp(-90, 90, self.getVelocity() / 30);
          gsap.to(curve, { y: v, duration: 0.25, ease: "power2.out", overwrite: true, onUpdate: render });
        },
        onLeave() {
          gsap.to(curve, { y: 0, duration: 1.4, ease: "elastic.out(1, 0.25)", overwrite: true, onUpdate: render });
        },
        onEnterBack() {
          gsap.to(curve, { y: 0, duration: 1.4, ease: "elastic.out(1, 0.25)", overwrite: true, onUpdate: render });
        },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <footer ref={root} className={cn("relative", className)}>
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute bottom-full left-0 h-24 w-full overflow-visible" style={{ color }}>
        <path ref={path} d="M0,100 Q50,100 100,100 L100,100 L0,100 Z" fill="currentColor" />
      </svg>
      <div style={{ background: color }}>{children}</div>
    </footer>
  );
}
