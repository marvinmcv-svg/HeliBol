"use client";
import { TextRotate } from "./text-rotate";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <h2 className="flex flex-wrap items-center justify-center gap-x-3 text-3xl font-semibold tracking-tight sm:text-5xl">
        <span>Build</span>
        <TextRotate
          words={["faster", "bolder", "smoother", "kinetik"]}
          className="rounded-xl bg-foreground px-3 py-1 text-background"
        />
        <span>interfaces</span>
      </h2>
    </div>
  );
}
