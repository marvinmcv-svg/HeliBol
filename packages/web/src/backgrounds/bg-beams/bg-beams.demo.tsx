"use client";
import { BgBeams } from "./bg-beams";
export default function Demo() {
  return (
    <BgBeams className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <p className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs">$ kinetik deploy --prod</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight">Ship at the speed of light.</h2>
    </BgBeams>
  );
}
