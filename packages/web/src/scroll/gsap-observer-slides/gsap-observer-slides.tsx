"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(Observer, SplitText, useGSAP);

export interface ObserverSlide {
  title: string;
  image: string;
  kicker?: string;
}

export interface GsapObserverSlidesProps {
  slides: ObserverSlide[];
  className?: string;
}

/**
 * Full-screen slides driven by GSAP Observer: one wheel flick, swipe or arrow key moves one
 * slide (infinite loop, either direction). Outer/inner wrappers counter-translate to create a
 * sliding mask, the image counter-zooms, and the title's characters roll in.
 */
export function GsapObserverSlides({ slides, className }: GsapObserverSlidesProps) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const cur = useRef(0);
  const busy = useRef(false);
  const chars = useRef<Element[][]>([]);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q("[data-slide]"), { autoAlpha: 0, zIndex: 0 });
      gsap.set(q("[data-slide]")[0], { autoAlpha: 1, zIndex: 1 });
      chars.current = q("[data-title]").map((el) => SplitText.create(el, { type: "chars" }).chars);
      const obs = Observer.create({
        target: root.current,
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        tolerance: 12,
        preventDefault: true,
        onDown: () => go(cur.current - 1, -1),
        onUp: () => go(cur.current + 1, 1),
      });
      return () => obs.kill();
    },
    { scope: root },
  );

  const go = contextSafe((to: number, dir: 1 | -1) => {
    if (busy.current) return;
    const n = slides.length;
    const next = ((to % n) + n) % n;
    const q = gsap.utils.selector(root);
    const all = q("[data-slide]");
    const from = all[cur.current];
    const target = all[next];
    cur.current = next;
    setIndex(next);
    if (reduced) {
      gsap.set(from, { autoAlpha: 0, zIndex: 0 });
      gsap.set(target, { autoAlpha: 1, zIndex: 1 });
      return;
    }
    busy.current = true;
    const outer = target.querySelector("[data-outer]");
    const inner = target.querySelector("[data-inner]");
    gsap
      .timeline({ defaults: { duration: 1.1, ease: "power3.inOut" }, onComplete: () => void (busy.current = false) })
      .set(target, { autoAlpha: 1, zIndex: 1 })
      .set(from, { zIndex: 0 })
      .fromTo(outer, { yPercent: 100 * dir }, { yPercent: 0 }, 0)
      .fromTo(inner, { yPercent: -100 * dir }, { yPercent: 0 }, 0)
      .fromTo(target.querySelector("img"), { scale: 1.4 }, { scale: 1 }, 0)
      .to(from.querySelector("img"), { yPercent: -15 * dir, duration: 1.1 }, 0)
      .fromTo(chars.current[next], { yPercent: 120 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", stagger: { each: 0.025, from: "random" } }, 0.35)
      .set(from, { autoAlpha: 0 })
      .set(from.querySelector("img"), { yPercent: 0 });
  });

  return (
    <div
      ref={root}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Slides — scroll, swipe or use arrow keys"
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") go(cur.current + 1, 1);
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(cur.current - 1, -1);
      }}
      className={cn("relative h-full w-full touch-none overflow-hidden bg-black outline-none", className)}
    >
      {slides.map((s, i) => (
        <section key={s.title} data-slide aria-hidden={index !== i} className="absolute inset-0">
          <div data-outer className="h-full w-full overflow-hidden">
            <div data-inner className="h-full w-full overflow-hidden">
              <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                {s.kicker && <p className="text-xs uppercase tracking-[0.3em] opacity-70">{s.kicker}</p>}
                <h3 data-title className="text-5xl font-semibold tracking-tight sm:text-6xl">{s.title}</h3>
              </div>
            </div>
          </div>
        </section>
      ))}
      <div className="absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2" aria-hidden>
        {slides.map((s, i) => (
          <span key={s.title} className={cn("h-6 w-1 rounded-full bg-white/30 transition-all duration-500", index === i && "h-10 bg-white")} />
        ))}
      </div>
      <p className="absolute left-5 top-4 z-10 font-mono text-xs text-white/70">
        {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </p>
    </div>
  );
}
