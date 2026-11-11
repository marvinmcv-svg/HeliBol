"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(useGSAP);

export interface HoverPreviewItem {
  title: string;
  meta: string;
  image: string;
  href?: string;
}

export interface GsapHoverPreviewProps {
  items: HoverPreviewItem[];
  className?: string;
}

/**
 * Agency-style project index: hovering a row reveals its image in a card that trails the
 * cursor (gsap.quickTo for x/y, velocity-based rotation) and clip-reveals between images.
 */
export function GsapHoverPreview({ items, className }: GsapHoverPreviewProps) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const reduced = useReducedMotion();
  const movers = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc; r: gsap.QuickToFunc } | null>(null);
  const lastX = useRef(0);

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(card.current, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
      movers.current = {
        x: gsap.quickTo(card.current, "x", { duration: 0.5, ease: "power3" }),
        y: gsap.quickTo(card.current, "y", { duration: 0.5, ease: "power3" }),
        r: gsap.quickTo(card.current, "rotation", { duration: 0.8, ease: "power3" }),
      };
    },
    { scope: root },
  );

  const onMove = contextSafe((e: React.PointerEvent) => {
    if (reduced || !movers.current) return;
    const b = root.current!.getBoundingClientRect();
    const x = e.clientX - b.left;
    movers.current.x(x);
    movers.current.y(e.clientY - b.top);
    movers.current.r(gsap.utils.clamp(-12, 12, (x - lastX.current) * 0.6));
    lastX.current = x;
  });

  const enter = contextSafe((i: number) => {
    setActive(i);
    if (reduced) return;
    gsap.to(card.current, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(1.6)" });
    const imgs = card.current!.querySelectorAll<HTMLElement>("[data-img]");
    gsap.fromTo(imgs[i], { clipPath: "inset(100% 0 0 0)", scale: 1.3 }, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 0.6, ease: "expo.out", overwrite: true });
  });

  const leave = contextSafe(() => {
    setActive(-1);
    gsap.to(card.current, { scale: 0, autoAlpha: 0, duration: 0.3, ease: "power2.in" });
  });

  return (
    <div ref={root} onPointerMove={onMove} onPointerLeave={leave} className={cn("relative", className)}>
      <ul className="divide-y divide-border border-y border-border">
        {items.map((it, i) => (
          <li key={it.title}>
            <a
              href={it.href ?? "#"}
              onClick={(e) => !it.href && e.preventDefault()}
              onPointerEnter={() => enter(i)}
              onFocus={() => enter(i)}
              onBlur={leave}
              className={cn("flex items-baseline justify-between gap-4 py-5 transition-[opacity,padding] duration-300", active !== -1 && active !== i && "opacity-30", active === i && "pl-3")}
            >
              <span className="text-3xl font-semibold tracking-tight sm:text-4xl">{it.title}</span>
              <span className="shrink-0 text-sm text-muted-foreground">{it.meta}</span>
            </a>
          </li>
        ))}
      </ul>
      <div ref={card} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 h-48 w-40 overflow-hidden rounded-xl shadow-2xl">
        {items.map((it, i) => (
          <img key={it.image} data-img src={it.image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ zIndex: i === active ? 2 : 1, clipPath: "inset(100% 0 0 0)" }} />
        ))}
      </div>
    </div>
  );
}
