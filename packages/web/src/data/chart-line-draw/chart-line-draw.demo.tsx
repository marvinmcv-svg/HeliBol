"use client";
import { ChartLineDraw } from "./chart-line-draw";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 p-6">
      <div className="flex items-baseline justify-between"><p className="text-sm font-semibold">Weekly signups</p><p className="text-xs text-muted-foreground">Hover the chart</p></div>
      <ChartLineDraw data={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => ({ label, value: [120, 180, 150, 260, 240, 330, 410][i] }))} />
    </div>
  );
}
