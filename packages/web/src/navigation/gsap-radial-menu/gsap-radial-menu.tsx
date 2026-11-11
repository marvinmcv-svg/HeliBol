"use client";
import { useRef, useState, type ComponentType } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Plus } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

gsap.registerPlugin(useGSAP);

export interface RadialItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onSelect?: () => void;
}

export interface GsapRadialMenuProps {
  items: RadialItem[];
  /** Orbit radius in px. */
  radius?: number;
  /** Arc in degrees the items spread over (360 = full circle). */
  arc?: number;
  /** Starting angle in degrees (−90 = straight up). */
  startAngle?: number;
  className?: string;
}

/**
 * A FAB that blooms into a ring of actions. Opening uses a bouncy back.out stagger; closing
 * runs a separate, quicker power3.in timeline (a different ease for the reverse direction),
 * so the exit feels crisp instead of replaying the bounce backwards.
 */
export function GsapRadialMenu({ items, radius = 96, arc = 360, startAngle = -90, className }: GsapRadialMenuProps) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: root });

  const pos = (i: number) => {
    const step = arc >= 360 ? arc / items.length : arc / Math.max(1, items.length - 1);
    const a = ((startAngle + step * i) * Math.PI) / 180;
    return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
  };

  const toggle = contextSafe(() => {
    const next = !open;
    setOpen(next);
    const els = root.current!.querySelectorAll<HTMLElement>("[data-item]");
    const fab = root.current!.querySelector("[data-fab-icon]");
    gsap.killTweensOf([els, fab]);
    if (reduced) {
      els.forEach((el, i) => gsap.set(el, { ...(next ? pos(i) : { x: 0, y: 0 }), autoAlpha: next ? 1 : 0, scale: 1 }));
      return;
    }
    if (next) {
      gsap.to(fab, { rotation: 135, duration: 0.5, ease: "back.out(2)" });
      els.forEach((el, i) =>
        gsap.fromTo(el, { x: 0, y: 0, scale: 0.3, autoAlpha: 0 }, { ...pos(i), scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(2.2)", delay: i * 0.045 }),
      );
    } else {
      gsap.to(fab, { rotation: 0, duration: 0.3, ease: "power3.in" });
      gsap.to([...els].reverse(), { x: 0, y: 0, scale: 0.3, autoAlpha: 0, duration: 0.25, ease: "power3.in", stagger: 0.025 });
    }
  });

  return (
    <div ref={root} className={cn("relative grid size-14 place-items-center", className)}>
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <button
            key={it.label}
            data-item
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            onClick={() => {
              it.onSelect?.();
              toggle();
            }}
            className="invisible absolute grid size-12 place-items-center rounded-full border border-border bg-card shadow-lg opacity-0 hover:bg-accent"
            title={it.label}
          >
            <Icon className="size-5" />
            <span className="sr-only">{it.label}</span>
          </button>
        );
      })}
      <button onClick={toggle} aria-expanded={open} aria-label={open ? "Close actions" : "Open actions"} className="relative z-10 grid size-14 place-items-center rounded-full bg-foreground text-background shadow-xl">
        <Plus data-fab-icon className="size-6" />
      </button>
    </div>
  );
}
