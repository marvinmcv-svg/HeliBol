"use client";
import { useRef, useState, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

export interface ScrollSpySection {
  id: string;
  label: string;
  content: ReactNode;
}

export interface GsapScrollSpyProps {
  sections: ScrollSpySection[];
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Long-read layout with a lateral progress rail: one ScrollTrigger per section sets the active
 * label, the rail's fill scrubs with overall progress, and clicking a label glides there
 * with ScrollToPlugin (offset-aware, inside any scroller).
 */
export function GsapScrollSpy({ sections, scroller, className }: GsapScrollSpyProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP(
    () => {
      const sc = scroller?.current ?? undefined;
      root.current!.querySelectorAll<HTMLElement>("[data-spy]").forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, scroller: sc, start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && setActive(i) });
      });
      gsap.fromTo(
        root.current!.querySelector("[data-fill]"),
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current!.querySelector("[data-body]"), scroller: sc, start: "top 50%", end: "bottom 50%", scrub: true } },
      );
    },
    { scope: root },
  );

  const go = contextSafe((i: number) => {
    const target = root.current!.querySelectorAll<HTMLElement>("[data-spy]")[i];
    const sc = scroller?.current ?? window;
    gsap.to(sc, { scrollTo: { y: target, offsetY: 24 }, duration: reduced ? 0 : 1, ease: "power3.inOut" });
  });

  return (
    <div ref={root} className={cn("relative flex gap-8", className)}>
      <nav aria-label="Sections" className="sticky top-6 h-fit shrink-0 self-start">
        <div className="relative flex gap-3">
          <div className="relative w-0.5 rounded-full bg-border">
            <div data-fill className="absolute inset-0 origin-top rounded-full bg-foreground" />
          </div>
          <ol className="space-y-3 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => go(i)}
                  aria-current={active === i ? "true" : undefined}
                  className={cn("flex items-center gap-2 text-left transition-[color,transform] duration-300", active === i ? "translate-x-1 text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  <span className="font-mono text-[10px] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <div data-body className="min-w-0 flex-1 space-y-16">
        {sections.map((s) => (
          <section key={s.id} id={s.id} data-spy>
            {s.content}
          </section>
        ))}
      </div>
    </div>
  );
}
