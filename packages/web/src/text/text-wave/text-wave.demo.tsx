"use client";
import { TextWave } from "./text-wave";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8">
      <TextWave trigger="loop" className="text-5xl font-bold tracking-tight">Hello, wave 👋</TextWave>
      <div className="flex gap-6 text-sm">
        {["Projects", "Writing", "Contact"].map((l) => <TextWave key={l} height={6} className="cursor-pointer rounded font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">{l}</TextWave>)}
      </div>
    </div>
  );
}
