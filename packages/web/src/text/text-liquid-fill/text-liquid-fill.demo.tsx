"use client";
import { useEffect, useState } from "react";
import { TextLiquidFill } from "./text-liquid-fill";

export default function Demo() {
  const [lvl, setLvl] = useState(15);
  useEffect(() => {
    const id = setInterval(() => setLvl((l) => (l >= 95 ? 15 : l + 20)), 1600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-foreground">
      <TextLiquidFill text="FLOW" level={lvl} className="text-[7rem] sm:text-[9rem]" />
      <label className="flex items-center gap-3 text-xs text-muted-foreground">
        Level
        <input type="range" min={0} max={100} value={lvl} onChange={(e) => setLvl(Number(e.target.value))} className="w-40" />
        <span className="w-8 tabular-nums">{lvl}%</span>
      </label>
    </div>
  );
}
