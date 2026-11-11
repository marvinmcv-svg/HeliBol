"use client";
import { useEffect, useRef, useState } from "react";
import { LazyDemo } from "./lazy-demo";

const MEDIA = new Set(["IMG", "SVG", "CANVAS", "VIDEO", "INPUT", "BUTTON", "TEXTAREA", "SELECT"]);

/** Union box of everything that actually paints, ignoring wrappers. Returns null for full-bleed demos. */
function paintedBox(stage: HTMLElement) {
  const vw = stage.clientWidth;
  const vh = stage.clientHeight;
  const pageBg = getComputedStyle(stage).backgroundColor;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const el of stage.querySelectorAll<HTMLElement>("*")) {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || r.right < 0 || r.bottom < 0 || r.left > vw || r.top > vh) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.opacity === "0" || cs.display === "contents") continue;
    const tag = el.tagName.toUpperCase();
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
    const bg = cs.backgroundColor;
    const paintsBg = (bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent" && bg !== pageBg) || cs.backgroundImage !== "none";
    const paints = MEDIA.has(tag) || hasText || paintsBg || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== "none";
    if (!paints) continue;
    // a painted surface covering (almost) the whole frame = full-bleed demo → leave as is
    if (r.width >= vw * 0.9 && r.height >= vh * 0.9 && (MEDIA.has(tag) || paintsBg)) return null;
    if (r.width >= vw * 0.9 && r.height >= vh * 0.9) continue;
    x0 = Math.min(x0, Math.max(0, r.left));
    y0 = Math.min(y0, Math.max(0, r.top));
    x1 = Math.max(x1, Math.min(vw, r.right));
    y1 = Math.max(y1, Math.min(vh, r.bottom));
  }
  return x1 > x0 ? { x0, y0, x1, y1, vw, vh } : null;
}

/**
 * Chrome-less demo used for REA thumbnail capture. Scroll demos are advanced to a mid-point so
 * the thumbnail shows the effect, and small components are zoomed to fill the 16:10 frame —
 * so gallery cards never look empty.
 */
export function ThumbStage({ id, fit = true }: { id: string; fit?: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let scrolled = false;
    timers.push(
      setTimeout(() => {
        const sc = stage.current?.querySelector<HTMLElement>("[data-lenis-prevent]");
        if (sc && sc.scrollHeight > sc.clientHeight * 1.5) {
          scrolled = true;
          sc.scrollTo({ top: (sc.scrollHeight - sc.clientHeight) * Number(sc.dataset.thumbAt ?? 0.42) });
          sc.querySelectorAll<HTMLElement>(".sticky.top-3").forEach((h) => (h.style.visibility = "hidden")); // "Scroll inside" hint
        }
      }, 700),
    );
    timers.push(
      setTimeout(() => {
        const s = stage.current;
        const box = fit && !scrolled && s ? paintedBox(s) : null;
        if (box && inner.current) {
          const bw = box.x1 - box.x0;
          const bh = box.y1 - box.y0;
          const scale = Math.min(2.4, 0.88 * Math.min(box.vw / bw, box.vh / bh));
          if (scale > 1.08) {
            const cx = (box.x0 + box.x1) / 2;
            const cy = (box.y0 + box.y1) / 2;
            inner.current.style.transformOrigin = "0 0";
            inner.current.style.transform = `translate(${box.vw / 2 - cx * scale}px, ${box.vh / 2 - cy * scale}px) scale(${scale})`;
          }
        }
      }, 1900),
    );
    timers.push(setTimeout(() => setReady(true), 2500));
    return () => timers.forEach(clearTimeout);
  }, [fit]);

  return (
    <div ref={stage} data-thumb-ready={ready || undefined} className="fixed inset-0 z-[200] overflow-hidden bg-background">
      <div ref={inner} className="h-full w-full">
        <LazyDemo id={id} eager />
      </div>
    </div>
  );
}
