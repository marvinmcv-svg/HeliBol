"use client";
import { HeroDepthLandscape } from "./hero-depth-landscape";

export default function Demo() {
  return (
    <HeroDepthLandscape>
      <p className="text-[10px] uppercase tracking-[0.4em] text-white/70">Expeditions · 2027</p>
      <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight sm:text-7xl">Beyond the ridge</h1>
      <a href="#trips" className="mt-6 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-zinc-900">See the trips</a>
    </HeroDepthLandscape>
  );
}
