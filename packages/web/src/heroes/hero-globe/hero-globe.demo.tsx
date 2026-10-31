"use client";
import { HeroGlobe } from "./hero-globe";
export default function Demo() {
  return (
    <HeroGlobe className="flex h-full w-full items-end justify-center p-8" arcs={[{ from: [38.7, -9.1], to: [40.7, -74] }, { from: [51.5, -0.1], to: [35.7, 139.7] }, { from: [-23.5, -46.6], to: [48.9, 2.3] }, { from: [1.35, 103.8], to: [37.8, -122.4] }]}>
      <div className="rounded-2xl border border-border bg-background/70 px-5 py-3 text-center backdrop-blur"><p className="text-xl font-semibold tracking-tight">Deployed to 38 regions</p><p className="text-xs text-muted-foreground">Edge-fast, everywhere.</p></div>
    </HeroGlobe>
  );
}
