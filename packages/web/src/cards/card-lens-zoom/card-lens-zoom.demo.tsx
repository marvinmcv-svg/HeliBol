"use client";
import { photos } from "../../_demo";
import { CardLensZoom } from "./card-lens-zoom";

export default function Demo() {
  return (
    <div className="flex h-full items-center justify-center gap-8 p-6">
      <CardLensZoom image={photos[5]} alt="Violet aurora sky" className="h-[90%] w-auto" />
      <div className="hidden max-w-[12rem] space-y-2 text-sm sm:block">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Print · 50×70</p>
        <h3 className="text-xl font-semibold">Aurora, Lofoten</h3>
        <p className="text-muted-foreground">Hover to inspect the grain. Scroll over the lens to change zoom.</p>
      </div>
    </div>
  );
}
