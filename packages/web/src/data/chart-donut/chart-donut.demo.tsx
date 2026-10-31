"use client";
import { ChartDonut } from "./chart-donut";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center p-6"><ChartDonut label="Visitors" data={[{ label: "Direct", value: 4820, color: "#8b5cf6" }, { label: "Search", value: 3610, color: "#06b6d4" }, { label: "Social", value: 2140, color: "#f472b6" }, { label: "Referral", value: 1290, color: "#f59e0b" }]} /></div>;
}
