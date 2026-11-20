"use client";
import { useState } from "react";
import { DemoCenter } from "../../_demo";
import { ChartGauge } from "./chart-gauge";

export default function Demo() {
  const [v, setV] = useState(78);
  return (
    <DemoCenter className="flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-4">
        <ChartGauge value={v} label="Performance" />
        <ChartGauge value={42} label="Disk used" unit="%" zones={[{ to: 60, color: "#22c55e" }, { to: 85, color: "#f59e0b" }, { to: 100, color: "#ef4444" }]} className="hidden sm:block" />
      </div>
      <button type="button" onClick={() => setV(Math.round(10 + Math.random() * 88))} className="rounded-full border px-3 py-1 text-xs">Re-measure</button>
    </DemoCenter>
  );
}
