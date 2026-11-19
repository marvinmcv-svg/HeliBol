"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface ScrollAreaProps {
  children: ReactNode;
  /** Accessible name for the scroll region. */
  label: string;
  className?: string;
  /** Height of the edge fades in px. */
  fade?: number;
}

/**
 * Native scrolling with a custom overlay scrollbar: the thumb appears while you scroll or hover,
 * grows when grabbed, and can be dragged; top/bottom fades appear only when there is more content
 * that way. Keyboard, wheel, touch and screen readers keep the native behaviour.
 */
export function ScrollArea({ children, label, className, fade = 32 }: ScrollAreaProps) {
  const reduced = useReducedMotion();
  const vp = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ top: 0, size: 1, atTop: true, atEnd: true });
  const [active, setActive] = useState(false);
  const [grab, setGrab] = useState(false);
  const hide = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const el = vp.current;
    if (!el) return;
    const measure = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const size = clientHeight / scrollHeight;
      setM({ top: (scrollTop / scrollHeight) * 100, size, atTop: scrollTop < 2, atEnd: scrollTop + clientHeight >= scrollHeight - 2 });
    };
    const onScroll = () => {
      measure();
      setActive(true);
      clearTimeout(hide.current);
      hide.current = setTimeout(() => setActive(false), 900);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { ro.disconnect(); el.removeEventListener("scroll", onScroll); clearTimeout(hide.current); };
  }, []);

  const dragThumb = (e: React.PointerEvent) => {
    const el = vp.current!;
    const startY = e.clientY, start = el.scrollTop;
    setGrab(true);
    const move = (ev: PointerEvent) => (el.scrollTop = start + (ev.clientY - startY) / m.size);
    const up = () => (setGrab(false), window.removeEventListener("pointermove", move), window.removeEventListener("pointerup", up));
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const scrollable = m.size < 1;
  const mask = `linear-gradient(to bottom, ${m.atTop ? "black" : "transparent"}, black ${fade}px, black calc(100% - ${fade}px), ${m.atEnd ? "black" : "transparent"})`;

  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <div
        ref={vp}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="h-full overflow-y-auto overscroll-contain outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-scrollbar]:hidden"
        style={{ maskImage: mask, WebkitMaskImage: mask, transition: reduced ? undefined : "mask-image .2s" }}
      >
        <div>{children}</div>
      </div>
      {scrollable && (
        <div aria-hidden className={cn("absolute inset-y-1 right-1 w-2.5 transition-opacity duration-300", active || grab ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
          <div
            onPointerDown={dragThumb}
            className={cn("absolute right-0 cursor-grab touch-none rounded-full bg-foreground/30 transition-[width,background-color] duration-150 hover:bg-foreground/50 active:cursor-grabbing", grab ? "w-2.5 bg-foreground/50" : "w-1.5")}
            style={{ top: `${m.top}%`, height: `${Math.max(8, m.size * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
