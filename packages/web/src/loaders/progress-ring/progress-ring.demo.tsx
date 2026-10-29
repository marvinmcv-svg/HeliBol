"use client";
import { useEffect, useState } from "react";
import { ProgressRing } from "./progress-ring";

export default function Demo() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const vals = [72, 35, 100, 58];
    let i = 0;
    setV(vals[0]);
    const id = setInterval(() => setV(vals[++i % vals.length]), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full w-full items-center justify-center gap-8 p-6">
      <ProgressRing value={v} className="text-violet-500" />
      <div className="flex flex-col gap-3">
        <ProgressRing value={Math.min(100, v + 15)} size={64} stroke={7} showValue={false} className="text-emerald-500" />
        <ProgressRing value={Math.max(0, v - 25)} size={64} stroke={7} showValue={false} className="text-amber-500" />
      </div>
    </div>
  );
}
