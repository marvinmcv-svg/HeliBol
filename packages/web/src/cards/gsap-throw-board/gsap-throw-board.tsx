"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(Draggable, InertiaPlugin, useGSAP);

export interface ThrowItem {
  node: ReactNode;
  /** Initial position in % of the board. */
  x: number;
  y: number;
  rotate?: number;
}

export interface GsapThrowBoardProps {
  items: ThrowItem[];
  className?: string;
}

/**
 * A desk of stickers you can pick up and throw: Draggable with InertiaPlugin keeps the
 * momentum after release, bounds keep everything on the board, the picked-up item lifts
 * (scale + shadow + tilt with velocity) and comes to the top of the pile.
 */
export function GsapThrowBoard({ items, className }: GsapThrowBoardProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-sticker]", root.current);
      let z = items.length;
      els.forEach((el, i) => gsap.set(el, { rotation: items[i].rotate ?? 0 }));
      if (!reduced) gsap.from(els, { scale: 0, rotation: "-=40", stagger: 0.06, duration: 0.7, ease: "back.out(2)" });
      const ds = Draggable.create(els, {
        bounds: root.current,
        inertia: !reduced,
        edgeResistance: 0.75,
        onPress() {
          gsap.set(this.target, { zIndex: ++z });
          gsap.to(this.target, { scale: 1.08, boxShadow: "0 24px 48px rgba(0,0,0,.35)", duration: 0.2 });
        },
        onDrag() {
          gsap.to(this.target, { rotation: gsap.utils.clamp(-25, 25, (this.deltaX ?? 0) * 1.5), duration: 0.3, overwrite: "auto" });
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, boxShadow: "0 6px 16px rgba(0,0,0,.2)", rotation: gsap.utils.random(-12, 12), duration: 0.5, ease: "back.out(2)" });
        },
      });
      return () => ds.forEach((d) => d.kill());
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className={cn("relative h-full w-full overflow-hidden", className)}>
      {items.map((it, i) => (
        <div
          key={i}
          data-sticker
          className="absolute cursor-grab touch-none select-none rounded-xl shadow-[0_6px_16px_rgba(0,0,0,.2)] active:cursor-grabbing"
          style={{ left: `${it.x}%`, top: `${it.y}%` }}
        >
          {it.node}
        </div>
      ))}
    </div>
  );
}
