"use client";
import { BgOrbitRings } from "./bg-orbit-rings";

export default function Demo() {
  return (
    <BgOrbitRings className="h-full">
      <div className="grid h-full place-items-start justify-center p-10 pt-14 text-center text-white">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-violet-200/70">Integrations</p>
          <h3 className="mt-2 text-4xl font-semibold tracking-tight">Everything in orbit</h3>
          <p className="mt-2 text-sm text-white/60">Connect the tools your team already uses.</p>
        </div>
      </div>
    </BgOrbitRings>
  );
}
