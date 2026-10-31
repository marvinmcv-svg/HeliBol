"use client";
import { TextFalling } from "./text-falling";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col p-8">
      <p className="text-xs text-muted-foreground">Click the headline</p>
      <TextFalling className="flex items-center justify-center border-b border-dashed border-border text-6xl font-black tracking-tight">gravity wins</TextFalling>
    </div>
  );
}
