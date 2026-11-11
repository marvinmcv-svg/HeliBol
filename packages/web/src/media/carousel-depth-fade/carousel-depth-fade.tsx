"use client";
import { useEffect, useRef } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface CarouselDepthFadeProps {
  items: { image: string; title: string; caption?: string }[];
  className?: string;
}

/**
 * A native scroll-snap carousel where each card's scale, blur, tilt and opacity are driven by its
 * distance from the centre — cards recede into depth as they slide away. Scroll, swipe or use keys.
 */
export function CarouselDepthFade({ items, className }: CarouselDepthFadeProps) {
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>("[data-card]")];
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      for (const c of cards) {
        const center = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.max(-1.5, Math.min(1.5, (center - mid) / c.offsetWidth)); // −1.5..1.5 card widths
        const a = Math.abs(d);
        if (reduced) {
          c.style.opacity = String(1 - Math.min(0.5, a * 0.35));
          continue;
        }
        c.style.transform = `perspective(900px) rotateY(${-d * 18}deg) scale(${1 - a * 0.16})`;
        c.style.filter = `blur(${a * 3}px) saturate(${1 - a * 0.4})`;
        c.style.opacity = String(1 - a * 0.4);
        c.style.zIndex = String(10 - Math.round(a * 4));
      }
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { el.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [reduced, items.length]);

  return (
    <div
      ref={track}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured"
      className={cn("flex h-full snap-x snap-mandatory items-center gap-4 overflow-x-auto px-[calc(50%-110px)] outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden", className)}
    >
      {items.map((it, i) => (
        <figure key={i} data-card aria-label={`${i + 1} of ${items.length}: ${it.title}`} className="relative h-[290px] w-[220px] shrink-0 snap-center overflow-hidden rounded-3xl bg-muted shadow-2xl will-change-transform">
          <img src={it.image} alt="" draggable={false} className="size-full object-cover" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <p className="text-sm font-semibold">{it.title}</p>
            {it.caption && <p className="text-xs text-white/70">{it.caption}</p>}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
