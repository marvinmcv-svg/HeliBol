"use client";
import { ChartLiveStream } from "./chart-live-stream";

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-5">
      <div className="grid w-full max-w-lg gap-3">
        <ChartLiveStream label="Requests / s" unit="k" />
        <ChartLiveStream label="p95 latency" unit=" ms" color="#f472b6" interval={900} />
      </div>
    </div>
  );
}
