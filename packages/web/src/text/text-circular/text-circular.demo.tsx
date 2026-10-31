"use client";
import { ArrowUpRight } from "lucide-react";
import { TextCircular } from "./text-circular";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-12 p-8">
      <TextCircular text="Available for work • 2026 • " className="text-foreground">
        <span className="grid size-16 place-items-center rounded-full bg-foreground text-background"><ArrowUpRight className="size-6" /></span>
      </TextCircular>
      <TextCircular text="Scroll to explore • scroll • " size={120} duration={9} reverse className="text-brand">
        <span className="size-3 rounded-full bg-brand" />
      </TextCircular>
    </div>
  );
}
