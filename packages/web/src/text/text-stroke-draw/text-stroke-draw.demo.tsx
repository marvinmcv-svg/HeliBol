"use client";
import { TextStrokeDraw } from "./text-stroke-draw";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-8">
      <TextStrokeDraw className="max-w-xl text-foreground">KINETIK</TextStrokeDraw>
      <TextStrokeDraw fontSize={64} duration={1.6} className="max-w-sm text-brand">motion</TextStrokeDraw>
    </div>
  );
}
