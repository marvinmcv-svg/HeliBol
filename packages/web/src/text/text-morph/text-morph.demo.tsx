"use client";
import { TextMorph } from "./text-morph";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-sm text-muted-foreground">Interfaces that feel</p>
      <TextMorph words={["liquid", "alive", "inevitable", "kinetik"]} className="text-6xl font-bold tracking-tight sm:text-7xl" />
    </div>
  );
}
