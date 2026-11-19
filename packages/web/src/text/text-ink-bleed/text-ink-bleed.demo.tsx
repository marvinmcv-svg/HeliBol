"use client";
import { useState } from "react";
import { TextInkBleed } from "./text-ink-bleed";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-[#f4efe6] p-8 text-center text-zinc-900">
      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Issue 07 — Autumn</p>
      <TextInkBleed key={k} as="h2" text="Words that settle like ink." className="max-w-xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl" />
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-zinc-500 underline underline-offset-4">Replay</button>
    </div>
  );
}
