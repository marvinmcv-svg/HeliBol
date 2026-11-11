"use client";
import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export interface GsapHorizontalTextProps {
  text: string;
  scroller?: RefObject<HTMLElement | null>;
  /** Scroll length in viewport heights. */
  length?: number;
  className?: string;
}

/**
 * One giant line of type slides sideways as you scroll down (pinned via sticky, x scrubbed by
 * ScrollTrigger). Each letter has its own ScrollTrigger on the horizontal tween
 * (containerAnimation) so letters drop in, rotate and recolor as they cross the screen.
 */
export function GsapHorizontalText({ text, scroller, length = 4, className }: GsapHorizontalTextProps) {
  const section = useRef<HTMLElement>(null);
  const line = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const sc = scroller?.current ?? undefined;
      const split = SplitText.create(line.current, { type: "chars" });
      const move = gsap.to(line.current, {
        x: () => -(line.current!.scrollWidth - section.current!.clientWidth),
        ease: "none",
        scrollTrigger: { trigger: section.current, scroller: sc, start: "top top", end: "bottom bottom", scrub: 0.5, invalidateOnRefresh: true },
      });
      split.chars.forEach((c, i) => {
        gsap.from(c, {
          yPercent: i % 2 ? -120 : 120,
          rotation: i % 2 ? -25 : 25,
          opacity: 0,
          color: "hsl(265 90% 70%)",
          ease: "back.out(2)",
          scrollTrigger: { trigger: c, containerAnimation: move, scroller: sc, start: "left 95%", end: "left 55%", scrub: 0.4 },
        });
      });
    },
    { scope: section, dependencies: [reduced, text] },
  );

  if (reduced) return <h3 className={cn("px-6 py-12 text-6xl font-black uppercase tracking-tight", className)}>{text}</h3>;

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: `${length * 100}cqh` }}>
      <div className="sticky top-0 flex h-[100cqh] items-center overflow-hidden">
        <h3 ref={line} className="whitespace-nowrap pl-[60vw] pr-[10vw] text-[clamp(5rem,22cqh,14rem)] font-black uppercase leading-none tracking-tighter">
          {text}
        </h3>
      </div>
    </section>
  );
}
