"use client";
import { useState } from "react";
import { PartyPopper } from "lucide-react";
import { GsapConfettiCannon } from "./gsap-confetti-cannon";

export default function Demo() {
  const [n, setN] = useState(0);
  return (
    <div className="flex h-full w-full flex-col items-center justify-end gap-3 pb-16">
      <p className="text-sm text-muted-foreground">{n === 0 ? "Ship it." : `Shipped ${n}× 🎉`}</p>
      <GsapConfettiCannon onFire={() => setN((x) => x + 1)}>
        <button className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-xl">
          <PartyPopper className="size-4" /> Publish release
        </button>
      </GsapConfettiCannon>
    </div>
  );
}
