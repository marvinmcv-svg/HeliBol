"use client";
import { photos } from "../../_demo";
import { CursorContextLabel } from "./cursor-context-label";

export default function Demo() {
  return (
    <CursorContextLabel className="h-full overflow-hidden p-6">
      <div className="grid h-full grid-cols-3 gap-3">
        <a href="#case" data-cursor="View case" className="col-span-2 overflow-hidden rounded-2xl"><img src={photos[2]} alt="Neon city haze" className="size-full object-cover" /></a>
        <div className="grid gap-3">
          <button data-cursor="Play" data-cursor-color="#a3e635" className="overflow-hidden rounded-2xl"><img src={photos[5]} alt="" className="size-full object-cover" /><span className="sr-only">Play reel</span></button>
          <a href="#about" data-cursor="Open ↗" className="grid place-items-center rounded-2xl bg-foreground text-sm font-semibold text-background">About the studio</a>
        </div>
      </div>
    </CursorContextLabel>
  );
}
