"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { GsapImageSequence } from "./gsap-image-sequence";

const FRAMES = 120;

/** Procedural "product spin": a glossy ring rotating and opening up, frame by frame. */
function draw(ctx: CanvasRenderingContext2D, f: number, w: number, h: number) {
  const t = f / (FRAMES - 1);
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
  g.addColorStop(0, `hsl(${260 + t * 60} 60% 16%)`);
  g.addColorStop(1, "#05050a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * (0.22 + t * 0.08);
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2 + t * Math.PI * 2;
    const tilt = Math.cos(t * Math.PI) * 0.85;
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R * Math.abs(tilt);
    const z = Math.sin(a);
    const r = 6 + (z + 1) * 6 + t * 6;
    ctx.beginPath();
    ctx.fillStyle = `hsla(${(i * 10 + t * 200) % 360} 85% ${50 + z * 15}% / ${0.55 + (z + 1) * 0.2})`;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <GsapImageSequence frames={FRAMES} draw={draw} scroller={s} length={3}>
      <div className="flex h-full flex-col justify-end p-6 text-white">
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">Image sequence · 120 frames</p>
        <h3 className="text-3xl font-semibold tracking-tight">Scroll scrubs every frame.</h3>
      </div>
    </GsapImageSequence>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
      <Inner />
    </DemoScroller>
  );
}
