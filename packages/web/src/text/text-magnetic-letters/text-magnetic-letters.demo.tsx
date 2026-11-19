"use client";
import { TextMagneticLetters } from "./text-magnetic-letters";

export default function Demo() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <TextMagneticLetters text="Push the letters" className="text-5xl tracking-tight sm:text-7xl" />
      <TextMagneticLetters text="or pull them closer" strength={-0.8} className="text-2xl text-muted-foreground sm:text-3xl" />
      <p className="mt-4 text-xs text-muted-foreground">Move your cursor through the words</p>
    </div>
  );
}
