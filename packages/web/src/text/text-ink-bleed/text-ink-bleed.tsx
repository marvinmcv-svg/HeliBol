"use client";
import { useEffect, useId, useRef, useState } from "react";
import { animate } from "motion/react";
import { cn, useInView, useReducedMotion } from "@kinetik/core";

export interface TextInkBleedProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  /** Seconds for the ink to settle. */
  duration?: number;
  className?: string;
}

/**
 * Headline that bleeds onto the page like ink on wet paper: an SVG turbulence displacement plus
 * blur both decay to zero while letters fade up word by word, leaving perfectly crisp type.
 * Replays when it re-enters the viewport.
 */
export function TextInkBleed({ text, as: Tag = "h2", duration = 1.8, className }: TextInkBleedProps) {
  const reduced = useReducedMotion();
  const id = `ink-${useId().replace(/:/g, "")}`;
  const ref = useRef<HTMLElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const blur = useRef<SVGFEGaussianBlurElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });
  const [p, setP] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) return setP(1);
    if (!inView) return setP(0);
    const ctl = animate(0, 1, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setP(v);
        disp.current?.setAttribute("scale", String((1 - v) * 60));
        blur.current?.setAttribute("stdDeviation", String((1 - v) * 6));
      },
    });
    return () => ctl.stop();
  }, [inView, reduced, duration]);

  const words = text.split(" ");
  return (
    <Tag ref={ref as never} className={cn("relative", className)} aria-label={text}>
      <svg aria-hidden className="absolute size-0">
        <filter id={id} x="-20%" y="-40%" width="140%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="noise" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="noise" scale="60" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur ref={blur} in="d" stdDeviation="6" />
        </filter>
      </svg>
      <span aria-hidden style={{ filter: p < 0.999 ? `url(#${id})` : undefined }} className="inline">
        {words.map((w, i) => {
          const local = Math.min(1, Math.max(0, p * 1.6 - (i / words.length) * 0.6));
          return (
            <span key={i} className="inline-block whitespace-pre" style={{ opacity: local, transform: `translateY(${(1 - local) * 0.25}em)` }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
