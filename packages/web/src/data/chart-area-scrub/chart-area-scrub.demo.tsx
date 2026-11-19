"use client";
import { ChartAreaScrub } from "./chart-area-scrub";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const values = [42, 48, 45, 53, 61, 58, 67, 73, 70, 82, 91, 104];

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-6">
      <ChartAreaScrub className="max-w-lg" data={months.map((label, i) => ({ label: `${label} 2026`, value: values[i] * 1000 }))} format={(v) => `$${(v / 1000).toFixed(0)}k`} title="Monthly recurring revenue" />
    </div>
  );
}
