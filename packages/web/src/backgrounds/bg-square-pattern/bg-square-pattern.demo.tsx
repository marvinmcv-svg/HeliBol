"use client";
import { useState } from "react";
import { BgSquarePattern, type BgSquarePatternProps } from "./bg-square-pattern";

const patterns: NonNullable<BgSquarePatternProps["pattern"]>[] = ["diagonal", "radial", "rain"];

export default function Demo() {
  const [p, setP] = useState<(typeof patterns)[number]>("diagonal");
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-[#0a0a12] text-white">
      <BgSquarePattern pattern={p} />
      <div className="relative flex gap-1.5 rounded-full border border-white/10 bg-black/60 p-1 text-xs backdrop-blur">
        {patterns.map((x) => (
          <button key={x} onClick={() => setP(x)} aria-pressed={x === p} className={`rounded-full px-3 py-1 capitalize ${x === p ? "bg-white text-black" : "text-white/70"}`}>{x}</button>
        ))}
      </div>
    </div>
  );
}
