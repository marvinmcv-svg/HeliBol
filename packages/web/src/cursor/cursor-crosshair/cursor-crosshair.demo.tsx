"use client";
import { CursorCrosshair } from "./cursor-crosshair";
export default function Demo() {
  return (
    <CursorCrosshair className="h-full w-full bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:32px_32px]">
      <div className="grid h-full place-items-center"><div className="rounded-xl border border-border bg-card px-5 py-3 font-mono text-sm">artboard · 1200 × 750</div></div>
    </CursorCrosshair>
  );
}
