"use client";
import { useState } from "react";
import { ThreeCoin } from "./three-coin";

export default function Demo() {
  const [flips, setFlips] = useState(0);
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_40%,#292524,#0c0a09_70%)] text-white">
      <ThreeCoin flipKey={flips} />
      <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-2">
        <button onClick={() => setFlips((f) => f + 1)} className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black shadow-[0_8px_30px_-6px_rgb(251_191_36/.6)] transition active:scale-95">Flip the coin</button>
        <span className="text-xs text-white/50" aria-live="polite">{flips ? `Flipped ${flips}×` : "Earn rewards on every trade"}</span>
      </div>
    </div>
  );
}
