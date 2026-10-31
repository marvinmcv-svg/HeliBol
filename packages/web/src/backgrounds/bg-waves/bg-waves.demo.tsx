"use client";
import { BgWaves } from "./bg-waves";
export default function Demo() {
  return (
    <BgWaves className="flex h-full w-full flex-col items-center justify-start p-12 text-center">
      <h2 className="text-4xl font-semibold tracking-tight">Find your flow.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Move the cursor up and down.</p>
    </BgWaves>
  );
}
