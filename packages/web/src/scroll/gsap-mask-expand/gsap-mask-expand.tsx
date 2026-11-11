"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface GsapMaskExpandProps {
  image: string;
  /** Text split across the opening window: left word, right word. */
  words?: [string, string];
  scroller?: RefObject<HTMLElement | null>;
  children?: ReactNode;
  className?: string;
}

/**
 * A small rounded window in the middle of a headline grows (clip-path inset scrubbed by a
 * pinned ScrollTrigger) until the image fills the screen, pushing the two words apart and
 * zooming the photo out from 1.5× — the classic "open the curtains" reveal.
 */
export function GsapMaskExpand({ image, words = ["Into", "the wild"], scroller, children, className }: GsapMaskExpandProps) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const q = gsap.utils.selector(section);
      gsap
        .timeline({ scrollTrigger: { trigger: section.current, scroller: scroller?.current ?? undefined, start: "top top", end: "bottom bottom", scrub: 0.6 } })
        .fromTo(q("[data-window]"), { clipPath: "inset(38% 39% 38% 39% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut" })
        .fromTo(q("[data-photo]"), { scale: 1.5 }, { scale: 1, ease: "power2.inOut" }, 0)
        .to(q("[data-left]"), { xPercent: -140, autoAlpha: 0, ease: "power2.in" }, 0)
        .to(q("[data-right]"), { xPercent: 140, autoAlpha: 0, ease: "power2.in" }, 0)
        .from(q("[data-after]"), { y: 40, autoAlpha: 0, duration: 0.3 }, 0.7);
    },
    { scope: section, dependencies: [reduced] },
  );

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: reduced ? "100cqh" : "260cqh" }}>
      <div className="sticky top-0 h-[100cqh] overflow-hidden">
        <div data-window className="absolute inset-0" style={{ clipPath: reduced ? undefined : "inset(38% 39% 38% 39% round 24px)" }}>
          <img data-photo src={image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        {!reduced && (
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center gap-[24%] text-5xl font-semibold tracking-tight sm:text-6xl">
            <span data-left>{words[0]}</span>
            <span data-right>{words[1]}</span>
          </div>
        )}
        <div data-after className="absolute inset-x-0 bottom-0 p-6 text-white">
          {children}
        </div>
      </div>
    </section>
  );
}
