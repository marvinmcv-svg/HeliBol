"use client";
import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { LayoutGrid, List, Rows3 } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(Flip, useGSAP);

type Mode = "grid" | "list" | "feature";

export interface GsapFlipLayoutProps {
  items: { id: string; image: string; title: string; meta: string }[];
  className?: string;
}

const container: Record<Mode, string> = {
  grid: "grid grid-cols-3 gap-3",
  list: "flex flex-col gap-2",
  feature: "grid grid-cols-4 gap-3 [&>*:first-child]:col-span-2 [&>*:first-child]:row-span-2",
};
const card: Record<Mode, string> = {
  grid: "flex flex-col",
  list: "flex flex-row items-center gap-3",
  feature: "flex flex-col",
};
const img: Record<Mode, string> = {
  grid: "aspect-[4/3] w-full",
  list: "size-12 shrink-0",
  feature: "aspect-square w-full",
};

/**
 * Grid ↔ list ↔ featured layout switch. React re-renders with the new classes and
 * Flip animates every card, image and caption from its old box to its new one —
 * including nested elements (getState on cards + images, `nested: true`).
 */
export function GsapFlipLayout({ items, className }: GsapFlipLayoutProps) {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("grid");
  const state = useRef<Flip.FlipState | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!state.current || reduced) return;
      Flip.from(state.current, { duration: 0.65, ease: "power3.inOut", nested: true, stagger: 0.025, absolute: false, scale: false });
      state.current = null;
    },
    { scope: root, dependencies: [mode] },
  );

  const change = (m: Mode) => {
    if (m === mode) return;
    state.current = Flip.getState(root.current!.querySelectorAll("[data-flip], [data-flip-img]"));
    setMode(m);
  };

  const modes: [Mode, typeof LayoutGrid, string][] = [["grid", LayoutGrid, "Grid"], ["list", List, "List"], ["feature", Rows3, "Featured"]];

  return (
    <div ref={root} className={cn("space-y-4", className)}>
      <div role="radiogroup" aria-label="Layout" className="inline-flex rounded-full border border-border p-1">
        {modes.map(([m, Icon, label]) => (
          <button key={m} role="radio" aria-checked={mode === m} onClick={() => change(m)} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors", mode === m ? "bg-foreground text-background" : "text-muted-foreground")}>
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>
      <div className={container[mode]}>
        {items.map((it) => (
          <article key={it.id} data-flip-id={it.id} data-flip className={cn("overflow-hidden rounded-xl border border-border bg-card p-2", card[mode])}>
            <img data-flip-img data-flip-id={`${it.id}-img`} src={it.image} alt="" className={cn("rounded-lg object-cover", img[mode])} />
            <div className={cn("min-w-0", mode !== "list" && "pt-2")}>
              <p className="truncate text-sm font-medium">{it.title}</p>
              <p className="truncate text-xs text-muted-foreground">{it.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
