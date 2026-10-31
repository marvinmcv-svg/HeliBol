"use client";
import { HeatmapGrid } from "./heatmap-grid";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center overflow-hidden p-6"><HeatmapGrid weeks={30} /></div>;
}
