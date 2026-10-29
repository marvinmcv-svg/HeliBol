"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface HorizontalScrollSectionProps {
  children: ReactNode;
  /** Scroll container (defaults to window). */
  scroller?: RefObject<HTMLElement | null>;
  /** Vertical scroll distance as a multiple of the viewport height. */
  length?: number;
  className?: string;
  trackClassName?: string;
}

/**
 * Vertical scroll drives a horizontal track. Pinning is native `position: sticky`
 * (robust inside any scroller); GSAP ScrollTrigger scrubs the x translation.
 */
export function HorizontalScrollSection({ children, scroller, length = 3, className, trackClassName }: HorizontalScrollSectionProps) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !track.current) return;
      gsap.to(track.current, {
        x: () => -(track.current!.scrollWidth - track.current!.parentElement!.clientWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          scroller: scroller?.current ?? undefined,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: section, dependencies: [reduced] },
  );

  if (reduced) {
    return (
      <section className={className}>
        <div className={cn("flex snap-x snap-mandatory gap-6 overflow-x-auto p-6", trackClassName)}>{children}</div>
      </section>
    );
  }

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: `${length * 100}cqh` }}>
      {/* cqh = nearest size container (a scroll panel) or the viewport when there is none */}
      <div className="sticky top-0 flex h-[100cqh] items-center overflow-hidden">
        <div ref={track} className={cn("flex gap-6 px-6 will-change-transform", trackClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
}
