"use client";
import { useRef, type ElementType, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export interface GsapLinesScrollProps {
  children: string;
  as?: ElementType;
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Responsive line-by-line reveal scrubbed by scroll: SplitText with autoSplit re-splits on
 * resize/font load (so lines are always the real rendered lines), each line rises out of its
 * mask and un-blurs in sequence as the paragraph travels up the viewport.
 */
export function GsapLinesScroll({ children, as: Tag = "p", scroller, className }: GsapLinesScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      SplitText.create(ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 100,
            opacity: 0.1,
            filter: "blur(6px)",
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: { trigger: ref.current, scroller: scroller?.current ?? undefined, start: "top 85%", end: "bottom 45%", scrub: 0.6 },
          }),
      });
    },
    { scope: ref, dependencies: [reduced, children] },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
