"use client";
import { CursorSmokeTrail } from "./cursor-smoke-trail";

export default function Demo() {
  return (
    <CursorSmokeTrail className="grid h-full place-items-center bg-[#06040c] text-white">
      <div className="pointer-events-none text-center">
        <h3 className="text-4xl font-semibold tracking-tight">Draw with smoke</h3>
        <p className="mt-2 text-sm text-white/55">Faster strokes leave thicker trails</p>
      </div>
    </CursorSmokeTrail>
  );
}
