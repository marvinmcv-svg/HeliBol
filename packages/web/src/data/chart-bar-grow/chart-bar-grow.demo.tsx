"use client";
import { ChartBarGrow } from "./chart-bar-grow";

const m = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const v = [32, 41, 38, 52, 49, 61, 58, 72, 69, 84, 91, 120];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 p-6">
      <div className="flex items-baseline justify-between"><p className="text-sm font-semibold">Monthly revenue (k$)</p><p className="text-xs text-muted-foreground">December highlighted</p></div>
      <ChartBarGrow data={m.map((label, i) => ({ label, value: v[i], highlight: i === 11 }))} />
    </div>
  );
}
