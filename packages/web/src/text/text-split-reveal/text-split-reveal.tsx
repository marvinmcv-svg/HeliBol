"use client";
import { useRef, type ElementType } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";
import { durationS, gsapEase, stagger as staggerTokens } from "@kinetik/tokens";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export interface TextSplitRevealProps {
  children: string;
  as?: ElementType;
  /** What to split into and stagger. */
  by?: "lines" | "words" | "chars";
  /** "mount" plays immediately, "view" waits until scrolled into view. */
  trigger?: "mount" | "view";
  duration?: number;
  stagger?: number;
  delay?: number;
  once?: boolean;
  className?: string;
}

export function TextSplitReveal({
  children,
  as: Tag = "h2",
  by = "lines",
  trigger = "view",
  duration = durationS.slower,
  stagger,
  delay = 0,
  once = true,
  className,
}: TextSplitRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: durationS.moderate, delay });
        return;
      }
      gsap.set(el, { autoAlpha: 1 });
      SplitText.create(el, {
        type: by === "chars" ? "words,chars" : by === "words" ? "lines,words" : "lines",
        mask: by === "chars" ? "words" : "lines",
        autoSplit: true,
        onSplit(self) {
          const targets = by === "chars" ? self.chars : by === "words" ? self.words : self.lines;
          return gsap.from(targets, {
            yPercent: 110,
            opacity: 0,
            duration,
            delay,
            ease: gsapEase.expoOut,
            stagger: stagger ?? (by === "chars" ? staggerTokens.tight : by === "words" ? staggerTokens.base : staggerTokens.loose),
            scrollTrigger:
              trigger === "view" ? { trigger: el, start: "top 90%", toggleActions: once ? "play none none none" : "play none none reverse" } : undefined,
          });
        },
      });
    },
    { scope: ref, dependencies: [children, by, reduced, trigger], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} className={cn("invisible", className)}>
      {children}
    </Tag>
  );
}
