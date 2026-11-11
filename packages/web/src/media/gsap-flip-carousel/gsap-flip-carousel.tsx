"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(Flip, useGSAP);

export interface GsapFlipCarouselProps {
  items: { image: string; title: string }[];
  className?: string;
}

/**
 * A carousel where the DOM order is the truth: "next" moves the first card to the end, and GSAP Flip
 * animates every card from its old box to its new one — the centre slot is simply bigger, so cards
 * grow and shrink as they pass through it.
 */
export function GsapFlipCarousel({ items, className }: GsapFlipCarouselProps) {
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const pending = useRef<Flip.FlipState | null>(null);
  const busy = useRef(false);

  const shift = (d: 1 | -1) => {
    if (busy.current || !track.current) return;
    if (!reduced) pending.current = Flip.getState(track.current.children, { props: "opacity" });
    setOrder((o) => (d > 0 ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)]));
  };

  // After React re-orders the DOM, play the Flip from the recorded state.
  useGSAP(
    () => {
      const state = pending.current;
      if (!state) return;
      pending.current = null;
      busy.current = true;
      Flip.from(state, { duration: 0.7, ease: "power3.inOut", absolute: false, nested: true, onComplete: () => void (busy.current = false) });
    },
    { dependencies: [order], scope: track },
  );

  const center = Math.floor(items.length / 2);
  return (
    <div
      className={cn("flex h-full flex-col items-center justify-center gap-5 overflow-hidden", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "ArrowRight" ? shift(1) : e.key === "ArrowLeft" ? shift(-1) : null)}
    >
      <div ref={track} className="flex items-center gap-3">
        {order.map((idx, pos) => {
          const it = items[idx];
          const isCenter = pos === center;
          const dist = Math.abs(pos - center);
          return (
            <figure
              key={idx}
              aria-hidden={!isCenter}
              className={cn("relative shrink-0 overflow-hidden rounded-2xl bg-muted shadow-lg", isCenter ? "h-64 w-48" : dist === 1 ? "h-44 w-28" : "h-32 w-16")}
              style={{ opacity: dist > 2 ? 0 : 1 - dist * 0.2 }}
            >
              <img src={it.image} alt="" className="size-full object-cover" draggable={false} />
              {isCenter && <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-3 text-sm font-medium text-white">{it.title}</figcaption>}
            </figure>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button type="button" aria-label="Previous" onClick={() => shift(-1)} className="grid size-10 place-items-center rounded-full border border-border hover:bg-muted"><ArrowLeft className="size-4" /></button>
        <button type="button" aria-label="Next" onClick={() => shift(1)} className="grid size-10 place-items-center rounded-full border border-border hover:bg-muted"><ArrowRight className="size-4" /></button>
      </div>
      <p className="sr-only" aria-live="polite">{items[order[center]].title}</p>
    </div>
  );
}
