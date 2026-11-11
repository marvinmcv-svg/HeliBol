"use client";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface GsapImageSequenceProps {
  /** Frame count. */
  frames: number;
  /** Returns the URL of frame i — or omit and pass `draw` to paint frames procedurally. */
  frameUrl?: (i: number) => string;
  /** Procedural painter (used by the demo; handy for generative sequences). */
  draw?: (ctx: CanvasRenderingContext2D, frame: number, w: number, h: number) => void;
  scroller?: RefObject<HTMLElement | null>;
  /** Scroll length in viewport heights. */
  length?: number;
  children?: ReactNode;
  className?: string;
}

/**
 * Apple-style scroll-scrubbed image sequence: a pinned canvas paints frame
 * round(progress × (frames − 1)) — tweening a plain { frame } object with scrub so it eases
 * between scroll positions. Frames are preloaded as Image objects; only one draw per change.
 */
export function GsapImageSequence({ frames, frameUrl, draw, scroller, length = 3, children, className }: GsapImageSequenceProps) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const current = useRef(0);
  const reduced = useReducedMotion();

  const paint = (i: number) => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = c.clientWidth;
    const h = c.clientHeight;
    if (c.width !== Math.round(w * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (draw) return draw(ctx, i, w, h);
    const img = images.current[i];
    if (!img?.complete) return;
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, (w - img.naturalWidth * s) / 2, (h - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
  };

  useEffect(() => {
    if (!frameUrl) return;
    images.current = Array.from({ length: frames }, (_, i) => {
      const im = new Image();
      im.src = frameUrl(i);
      if (i === 0) im.onload = () => paint(0);
      return im;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames, frameUrl]);

  useGSAP(
    () => {
      paint(reduced ? frames - 1 : 0);
      if (reduced) return;
      const seq = { frame: 0 };
      gsap.to(seq, {
        frame: frames - 1,
        snap: "frame",
        ease: "none",
        onUpdate: () => {
          if (seq.frame !== current.current) {
            current.current = seq.frame;
            paint(seq.frame);
          }
        },
        scrollTrigger: { trigger: section.current, scroller: scroller?.current ?? undefined, start: "top top", end: "bottom bottom", scrub: 0.5 },
      });
    },
    { scope: section, dependencies: [reduced, frames] },
  );

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: reduced ? "100cqh" : `${length * 100}cqh` }}>
      <div className="sticky top-0 h-[100cqh] overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
        <div className="relative h-full">{children}</div>
      </div>
    </section>
  );
}
