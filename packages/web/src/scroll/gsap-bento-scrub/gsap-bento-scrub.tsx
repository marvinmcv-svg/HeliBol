"use client";
import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(Flip, ScrollTrigger, useGSAP);

export interface GsapBentoScrubProps {
  /** 7 images: index 0 is the hero that starts full-bleed. */
  images: string[];
  scroller?: RefObject<HTMLElement | null>;
  title?: string;
  className?: string;
}

const AREAS = ["hero", "a", "b", "c", "d", "e", "f"];

/**
 * A full-bleed hero image settles into the middle of a bento grid as you scroll. Flip records
 * the "final" grid state, then a scrubbed Flip.from (tied to a pinned ScrollTrigger) plays the
 * layout change backwards and forwards with the scrollbar.
 */
export function GsapBentoScrub({ images, scroller, title = "Every frame, in its place.", className }: GsapBentoScrubProps) {
  const section = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const g = grid.current!;
      const hero = g.querySelector<HTMLElement>("[data-area='hero']")!;
      if (reduced) return;
      // final layout = the grid; start layout = hero covering the whole sticky stage
      const state = Flip.getState(g.querySelectorAll("[data-cell]"), { props: "borderRadius" });
      Object.assign(hero.style, { position: "absolute", inset: "0", zIndex: "10", borderRadius: "0px" });
      const tl = Flip.to(state, { ease: "none", absolute: true, scale: true, simple: true, props: "borderRadius" });
      const items = g.querySelectorAll("[data-cell]:not([data-area='hero'])");
      tl.fromTo(items, { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.05, duration: 0.3 }, 0.35);
      ScrollTrigger.create({
        trigger: section.current,
        scroller: scroller?.current ?? undefined,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        animation: tl,
      });
    },
    { scope: section, dependencies: [reduced] },
  );

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: reduced ? undefined : "260cqh" }}>
      <div className="sticky top-0 flex h-[100cqh] flex-col gap-3 overflow-hidden p-3">
        <p className="text-center text-sm font-medium tracking-tight text-muted-foreground">{title}</p>
        <div ref={grid} className="grid min-h-0 flex-1 grid-cols-4 grid-rows-3 gap-2 [grid-template-areas:'a_hero_hero_b'_'c_hero_hero_d'_'e_f_f_d']">
          {AREAS.map((a, i) => (
            <div key={a} data-cell data-area={a} className="overflow-hidden rounded-xl bg-muted" style={{ gridArea: a }}>
              {images[i] && <img src={images[i]} alt="" className="h-full w-full object-cover" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
