"use client";
import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(Draggable, InertiaPlugin, useGSAP);

export interface GsapInfiniteSliderProps {
  slides: ReactNode[];
  /** Card width in px. */
  itemWidth?: number;
  gap?: number;
  /** Seconds between auto-advances (0 = off). */
  autoplay?: number;
  className?: string;
}

/**
 * Seamless infinite slider. Every card's x is a wrap() of one shared offset, so there is no
 * cloning and no jump at the seams. Drag/flick it (Draggable + Inertia on a proxy, snapping to
 * whole cards), use the arrows or keys; cards scale/fade with their distance from center.
 */
export function GsapInfiniteSlider({ slides, itemWidth = 240, gap = 20, autoplay = 0, className }: GsapInfiniteSliderProps) {
  const root = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0 });
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const step = itemWidth + gap;
  const total = step * slides.length;

  const layout = () => {
    const el = root.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    const center = el.clientWidth / 2 - itemWidth / 2;
    // each card's distance from center, wrapped into [-total/2, total/2) → seamless loop
    const wrap = gsap.utils.wrap(-total / 2, total / 2);
    cards.forEach((card, i) => {
      const x = wrap(i * step + offset.current.x);
      const dist = Math.min(1, Math.abs(x) / (step * 2.2));
      gsap.set(card, { x: center + x, scale: 1 - dist * 0.18, opacity: 1 - dist * 0.55, zIndex: Math.round(10 - dist * 10) });
    });
    const idx = Math.round(-offset.current.x / step);
    setActive(((idx % slides.length) + slides.length) % slides.length);
  };

  const { contextSafe } = useGSAP(
    () => {
      layout();
      const proxy = document.createElement("div");
      const d = Draggable.create(proxy, {
        type: "x",
        trigger: root.current,
        inertia: !reduced,
        onPress() {
          gsap.killTweensOf(offset.current);
          gsap.set(proxy, { x: offset.current.x });
        },
        onDrag() {
          offset.current.x = gsap.getProperty(proxy, "x") as number;
          layout();
        },
        onThrowUpdate() {
          offset.current.x = gsap.getProperty(proxy, "x") as number;
          layout();
        },
        snap: { x: (v: number) => Math.round(v / step) * step },
        onRelease() {
          if (reduced || !this.tween) to(Math.round(offset.current.x / step) * step);
        },
      })[0];
      const ro = new ResizeObserver(layout);
      ro.observe(root.current!);
      let timer: ReturnType<typeof setInterval> | undefined;
      if (autoplay > 0 && !reduced) timer = setInterval(() => !d.isPressed && to(Math.round(offset.current.x / step) * step - step), autoplay * 1000);
      return () => {
        ro.disconnect();
        clearInterval(timer);
        d.kill();
      };
    },
    { scope: root, dependencies: [slides.length, step, reduced, autoplay] },
  );

  const to = contextSafe((x: number) => {
    gsap.to(offset.current, { x, duration: reduced ? 0 : 0.8, ease: "power3.out", overwrite: true, onUpdate: layout });
  });
  const nav = (dir: 1 | -1) => to(Math.round(offset.current.x / step) * step - dir * step);

  return (
    <div
      ref={root}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Slider — drag, use arrows or arrow keys"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") nav(1);
        if (e.key === "ArrowLeft") nav(-1);
      }}
      className={cn("relative h-full w-full cursor-grab touch-pan-y select-none overflow-hidden outline-none active:cursor-grabbing", className)}
    >
      {slides.map((s, i) => (
        <div key={i} data-card aria-hidden={active !== i} className="absolute left-0 top-1/2 -translate-y-1/2" style={{ width: itemWidth }}>
          {s}
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-3">
        <button onClick={() => nav(-1)} aria-label="Previous" className="grid size-9 place-items-center rounded-full border border-border bg-background/80 backdrop-blur hover:bg-accent"><ChevronLeft className="size-4" /></button>
        <span className="min-w-12 text-center font-mono text-xs text-muted-foreground">{active + 1} / {slides.length}</span>
        <button onClick={() => nav(1)} aria-label="Next" className="grid size-9 place-items-center rounded-full border border-border bg-background/80 backdrop-blur hover:bg-accent"><ChevronRight className="size-4" /></button>
      </div>
    </div>
  );
}
