"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(Draggable, useGSAP);

export interface GsapCardStackProps {
  cards: ReactNode[];
  className?: string;
}

/**
 * A fanned stack of cards. Drag the top card (or press Next / Space) and it arcs off, then
 * tucks in behind the deck; everyone else steps forward. Positions are computed from each
 * card's place in a rotating order array, so it loops forever.
 */
export function GsapCardStack({ cards, className }: GsapCardStackProps) {
  const root = useRef<HTMLDivElement>(null);
  const order = useRef<number[]>(cards.map((_, i) => i));
  const busy = useRef(false);
  const reduced = useReducedMotion();

  const place = (dur: number) => {
    const els = root.current!.querySelectorAll<HTMLElement>("[data-card]");
    order.current.forEach((cardIdx, pos) => {
      gsap.to(els[cardIdx], {
        x: 0,
        y: pos * -18,
        scale: 1 - pos * 0.06,
        rotation: pos === 0 ? 0 : (pos % 2 ? 1 : -1) * pos * 3.5,
        zIndex: cards.length - pos,
        opacity: pos > 3 ? 0 : 1,
        duration: dur,
        ease: "power3.out",
      });
      els[cardIdx].setAttribute("aria-hidden", pos === 0 ? "false" : "true");
    });
  };

  const { contextSafe } = useGSAP(
    () => {
      place(0);
      const els = root.current!.querySelectorAll<HTMLElement>("[data-card]");
      const ds = Draggable.create(els, {
        type: "x,y",
        onPress() {
          if (this.target !== els[order.current[0]]) this.endDrag(this.pointerEvent);
        },
        onDrag() {
          gsap.set(this.target, { rotation: this.x * 0.06 });
        },
        onRelease() {
          if (Math.hypot(this.x, this.y) > 90) cycle(Math.sign(this.x) || 1);
          else gsap.to(this.target, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: "back.out(2)" });
        },
      });
      return () => ds.forEach((d) => d.kill());
    },
    { scope: root },
  );

  const cycle = contextSafe((dir = 1) => {
    if (busy.current) return;
    const els = root.current!.querySelectorAll<HTMLElement>("[data-card]");
    const top = els[order.current[0]];
    order.current = [...order.current.slice(1), order.current[0]];
    if (reduced) return place(0);
    busy.current = true;
    gsap
      .timeline({ onComplete: () => void (busy.current = false) })
      .to(top, { x: dir * 260, y: -40, rotation: dir * 18, duration: 0.35, ease: "power2.out" })
      .add(() => place(0.6))
      .set(top, { zIndex: 0 })
      .to(top, { x: 0, y: (cards.length - 1) * -18, rotation: 0, scale: 1 - (cards.length - 1) * 0.06, opacity: cards.length > 4 ? 0 : 1, duration: 0.6, ease: "power3.inOut" });
  });

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div
        ref={root}
        tabIndex={0}
        aria-label="Card stack — drag the top card or press Space"
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "ArrowRight") {
            e.preventDefault();
            cycle(1);
          }
        }}
        className="relative h-80 w-60 outline-none"
      >
        {cards.map((c, i) => (
          <div key={i} data-card className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing">
            {c}
          </div>
        ))}
      </div>
      <button onClick={() => cycle(1)} className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-accent">Next card</button>
    </div>
  );
}
