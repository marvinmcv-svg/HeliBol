"use client";
import { useState } from "react";
import { WidgetWeather, type Weather } from "./widget-weather";
const data: Record<Weather, [number, number, number]> = { sunny: [24, 27, 16], cloudy: [18, 20, 13], rainy: [12, 14, 9], night: [9, 15, 6] };
export default function Demo() {
  const [w, setW] = useState<Weather>("sunny");
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <WidgetWeather weather={w} city="Lisbon" temp={data[w][0]} hi={data[w][1]} lo={data[w][2]} />
      <div className="flex gap-1.5">{(Object.keys(data) as Weather[]).map((k) => <button key={k} onClick={() => setW(k)} aria-pressed={w === k} className="rounded-full border border-border px-3 py-1 text-xs capitalize aria-pressed:bg-foreground aria-pressed:text-background">{k}</button>)}</div>
    </div>
  );
}
