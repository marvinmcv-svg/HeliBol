"use client";
import { useState } from "react";
import { IconMorph, type IconMorphKind } from "./icon-morph";
const kinds: IconMorphKind[] = ["menu-close", "play-pause", "plus-minus", "arrow-check"];
export default function Demo() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  return (
    <div className="flex h-full w-full items-center justify-center gap-4 p-8">
      {kinds.map((k) => (
        <button key={k} onClick={() => setOn((s) => ({ ...s, [k]: !s[k] }))} aria-pressed={!!on[k]} aria-label={k} className="grid size-16 place-items-center rounded-2xl border border-border bg-card hover:bg-accent">
          <IconMorph kind={k} active={!!on[k]} />
        </button>
      ))}
    </div>
  );
}
