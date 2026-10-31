"use client";
import { TextLoopLines } from "./text-loop-lines";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
        <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
        <TextLoopLines className="h-5 w-56" items={["Building 71 components…", "Optimizing thumbnails…", "Deploying to the edge…", "Live in 38 regions ✓"]} />
      </div>
      <TextLoopLines direction="down" interval={3000} className="h-12 text-3xl font-semibold tracking-tight" items={["Ship faster.", "Animate better.", "Sleep well."]} />
    </div>
  );
}
