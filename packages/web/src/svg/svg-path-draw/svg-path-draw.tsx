"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, useGSAP);

export interface SvgPathDrawProps {
  /** SVG markup (paths, lines, circles…) — every stroked shape is drawn. */
  children: ReactNode;
  viewBox: string;
  /** "view" draws once on enter; "scrub" ties drawing to scroll position. */
  mode?: "view" | "scrub";
  scroller?: RefObject<HTMLElement | null>;
  duration?: number;
  stagger?: number;
  className?: string;
}

export function SvgPathDraw({ children, viewBox, mode = "view", scroller, duration = 1.6, stagger = 0.15, className }: SvgPathDrawProps) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced) return;
      const shapes = ref.current!.querySelectorAll("path, line, polyline, circle, rect, ellipse");
      gsap.from(shapes, {
        drawSVG: 0,
        duration,
        stagger,
        ease: mode === "scrub" ? "none" : "power2.inOut",
        scrollTrigger: {
          trigger: ref.current,
          scroller: scroller?.current ?? undefined,
          start: "top 80%",
          end: mode === "scrub" ? "bottom 40%" : undefined,
          scrub: mode === "scrub" ? 0.5 : false,
        },
      });
    },
    { scope: ref, dependencies: [reduced, mode] },
  );
  return (
    <svg ref={ref} viewBox={viewBox} fill="none" className={cn("overflow-visible", className)}>
      {children}
    </svg>
  );
}
