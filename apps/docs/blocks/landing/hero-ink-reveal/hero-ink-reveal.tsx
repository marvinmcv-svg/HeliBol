"use client";
import { useEffect, useRef } from "react";
import { usePrefersTouch, useReducedMotion } from "@kinetik/core";

/**
 * Ink reveal hero: moving the cursor paints soft, blooming ink blots that reveal a second image
 * (colour) through the first (monochrome). Blots spread, then slowly dry away. The mask is a
 * canvas used as CSS mask-image via a data URL-free approach: the colour photo is drawn into the
 * canvas with "source-in" compositing.
 */
export function HeroInkReveal({ base = "/demo/photo-2.jpg", reveal = "/demo/photo-2.jpg" }: { base?: string; reveal?: string }) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current, c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!el || !c || !ctx) return;
    const img = new Image();
    img.src = reveal;
    const blots: { x: number; y: number; r: number; max: number; life: number }[] = [];
    let w = 0, h = 0, raf = 0, last: { x: number; y: number } | null = null;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => { w = el.clientWidth; h = el.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const add = (x: number, y: number, big = 1) => blots.push({ x: x + (Math.random() - 0.5) * 20, y: y + (Math.random() - 0.5) * 20, r: 4, max: (40 + Math.random() * 50) * big, life: 1 });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const p = { x: e.clientX - r.left, y: e.clientY - r.top };
      const dist = last ? Math.hypot(p.x - last.x, p.y - last.y) : 999;
      if (dist > 18) { add(p.x, p.y); last = p; }
    };
    const down = (e: PointerEvent) => { const r = el.getBoundingClientRect(); for (let i = 0; i < 6; i++) add(e.clientX - r.left, e.clientY - r.top, 1.8); };

    const cover = (iw: number, ih: number) => { const s = Math.max(w / iw, h / ih); return [(w - iw * s) / 2, (h - ih * s) / 2, iw * s, ih * s] as const; };
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      for (let i = blots.length - 1; i >= 0; i--) {
        const b = blots[i];
        b.r += (b.max - b.r) * 0.08; // bloom
        b.life -= 0.0045; // dry
        if (b.life <= 0) { blots.splice(i, 1); continue; }
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(0,0,0,${Math.min(1, b.life * 1.4)})`);
        g.addColorStop(0.7, `rgba(0,0,0,${b.life * 0.8})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        // wobbly ink edge
        for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 10) {
          const rr = b.r * (0.85 + 0.15 * Math.sin(a * 3 + b.x));
          ctx[a === 0 ? "moveTo" : "lineTo"](b.x + Math.cos(a) * rr, b.y + Math.sin(a) * rr);
        }
        ctx.fill();
      }
      if (img.complete && img.naturalWidth) {
        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(img, ...cover(img.naturalWidth, img.naturalHeight));
      }
      raf = requestAnimationFrame(frame);
    };
    if (!reduced && !touch) {
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerdown", down);
      raf = requestAnimationFrame(frame);
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerdown", down); };
  }, [reveal, reduced, touch]);

  return (
    <section ref={wrap} className="relative h-full min-h-[520px] overflow-hidden rounded-[2rem] bg-[#f3efe7] text-zinc-900">
      {/* base: monochrome. Under reduced motion / touch the colour image simply shows. */}
      <img src={base} alt="" className="absolute inset-0 size-full object-cover" style={{ filter: reduced || touch ? "none" : "grayscale(1) contrast(1.1) brightness(1.08)" }} />
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f3efe7] via-[#f3efe7]/70 to-transparent" />
      <div className="relative flex h-full max-w-xl flex-col justify-center p-8 sm:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Ink & Field — Studio</p>
        <h1 className="mt-4 font-serif text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.95] tracking-tight">Colour is<br /><em className="text-violet-700">earned.</em></h1>
        <p className="mt-5 max-w-sm text-zinc-600">Move across the image to bleed colour into it. Click to spill more.</p>
        <a href="#work" className="pointer-events-auto mt-8 w-fit rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white">See the series</a>
      </div>
    </section>
  );
}
