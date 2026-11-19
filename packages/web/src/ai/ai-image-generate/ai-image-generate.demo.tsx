"use client";
import { useState } from "react";
import { photos } from "../../_demo";
import { AiImageGenerate } from "./ai-image-generate";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <AiImageGenerate runKey={k} image={photos[5]} prompt="violet aurora over a frozen fjord, long exposure, 35mm film" className="max-w-[17rem]" />
      <button onClick={() => setK((x) => x + 1)} className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background">Regenerate</button>
    </div>
  );
}
