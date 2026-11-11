"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(SplitText, useGSAP);

export interface GsapMenuOverlayProps {
  links: { label: string; href?: string; meta?: string }[];
  brand?: string;
  /** Start open (e.g. for previews). */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Full-screen menu built as ONE paused timeline: panels wipe down, link letters rise, the
 * footer fades. Open = play(), close = reverse() with timeScale(1.8) — so it is fully
 * interruptible: click mid-animation and it turns around from exactly where it is.
 */
export function GsapMenuOverlay({ links, brand = "studio®", defaultOpen = false, className }: GsapMenuOverlayProps) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const chars = q("[data-link-text]").flatMap((el) => SplitText.create(el, { type: "chars", mask: "chars" }).chars);
      gsap.set(q("[data-overlay]"), { autoAlpha: 1 });
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .fromTo(q("[data-panel]"), { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", duration: reduced ? 0.01 : 0.8, stagger: 0.08 })
        .from(chars, { yPercent: 110, duration: reduced ? 0.01 : 0.7, ease: "expo.out", stagger: 0.012 }, reduced ? 0 : "-=0.35")
        .from(q("[data-foot]"), { autoAlpha: 0, y: 12, duration: 0.4, ease: "power2.out" }, "-=0.4");
      gsap.set(q("[data-overlay]"), { pointerEvents: "none" });
    },
    { scope: root, dependencies: [reduced] },
  );

  useEffect(() => {
    const t = tl.current;
    const ov = root.current?.querySelector<HTMLElement>("[data-overlay]");
    if (!t || !ov) return;
    ov.style.pointerEvents = open ? "auto" : "none";
    if (open) t.timeScale(1).play();
    else t.timeScale(1.8).reverse();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={root} className={cn("relative h-full w-full overflow-hidden", className)}>
      <header className="relative z-20 flex items-center justify-between p-5">
        <span className={cn("font-semibold tracking-tight transition-colors duration-500", open && "text-background")}>{brand}</span>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className={cn("rounded-full border px-4 py-1.5 text-sm transition-colors duration-500", open ? "border-background/40 text-background" : "border-border")}>
          {open ? "Close" : "Menu"}
        </button>
      </header>
      <div data-overlay className="invisible absolute inset-0 z-10" aria-hidden={!open}>
        <div className="absolute inset-0 flex">
          {[0, 1, 2].map((i) => (
            <div key={i} data-panel className="h-full flex-1 bg-foreground" />
          ))}
        </div>
        <nav className="relative flex h-full flex-col justify-center gap-1 px-8 text-background">
          {links.map((l, i) => (
            <a key={l.label} data-link href={l.href ?? "#"} tabIndex={open ? 0 : -1} onClick={(e) => (!l.href && e.preventDefault(), setOpen(false))} className="group flex items-baseline gap-4">
              <span className="font-mono text-xs opacity-50">0{i + 1}</span>
              <span data-link-text className="text-5xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2 sm:text-6xl">{l.label}</span>
              {l.meta && <span className="text-xs opacity-50">{l.meta}</span>}
            </a>
          ))}
          <div data-foot className="mt-8 flex gap-6 text-xs opacity-60"><span>hello@studio.dev</span><span>Instagram</span><span>Dribbble</span></div>
        </nav>
      </div>
    </div>
  );
}
