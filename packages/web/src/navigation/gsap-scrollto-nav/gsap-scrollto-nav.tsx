"use client";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export interface ScrollToSection {
  id: string;
  label: string;
  content: ReactNode;
}

export interface GsapScrollToNavProps {
  sections: ScrollToSection[];
  /** The element that scrolls (defaults to window). */
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Docs-style table of contents: clicking a link glides the scroller to the section with GSAP's
 * ScrollToPlugin (eased, interruptible, offset for the sticky header), while ScrollTriggers track the
 * active section and a bar slides beside the current link.
 */
export function GsapScrollToNav({ sections, scroller, className }: GsapScrollToNavProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = sections.map((s) => root.current!.querySelector<HTMLElement>(`#${CSS.escape(s.id)}`)!);
    const triggers = els.map((el, i) =>
      ScrollTrigger.create({ trigger: el, scroller: scroller?.current ?? undefined, start: "top 40%", end: "bottom 40%", onToggle: (self) => self.isActive && setActive(i) }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, [sections, scroller]);

  useEffect(() => {
    const link = list.current?.children[active] as HTMLElement | undefined;
    if (!link || !bar.current) return;
    gsap.to(bar.current, { y: link.offsetTop, height: link.offsetHeight, duration: reduced ? 0 : 0.45, ease: "power3.out" });
  }, [active, reduced]);

  const go = (i: number) => {
    const el = root.current!.querySelector<HTMLElement>(`#${CSS.escape(sections[i].id)}`)!;
    gsap.to(scroller?.current ?? window, { duration: reduced ? 0 : 1, ease: "power3.inOut", scrollTo: { y: el, offsetY: 16, autoKill: true }, overwrite: true });
    el.focus({ preventScroll: true });
  };

  return (
    <div ref={root} className={cn("grid grid-cols-[9rem_1fr] gap-6", className)}>
      <nav aria-label="On this page" className="sticky top-4 h-fit">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">On this page</p>
        <div className="relative pl-3">
          <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-border" />
          <span ref={bar} aria-hidden className="absolute left-0 top-0 w-0.5 -translate-x-[0.5px] rounded-full bg-primary" style={{ height: 0 }} />
          <ul ref={list} className="space-y-1">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={i === active ? "location" : undefined}
                  onClick={(e) => (e.preventDefault(), go(i))}
                  className={cn("block py-0.5 text-sm transition-colors", i === active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="space-y-10 pb-[60cqh]">
        {sections.map((s) => (
          <section key={s.id} id={s.id} tabIndex={-1} aria-label={s.label} className="scroll-mt-4 outline-none">
            {s.content}
          </section>
        ))}
      </div>
    </div>
  );
}
