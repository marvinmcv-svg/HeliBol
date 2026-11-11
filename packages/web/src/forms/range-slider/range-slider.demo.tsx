"use client";
import { useState } from "react";
import { RangeSlider } from "./range-slider";

const histogram = [2, 4, 7, 12, 18, 26, 30, 28, 22, 19, 15, 13, 10, 8, 7, 5, 4, 3, 2, 2, 1, 1, 1, 1];

export default function Demo() {
  const [v, setV] = useState<[number, number]>([120, 340]);
  return (
    <div className="grid h-full place-items-center p-8">
      <RangeSlider label="Price per night" value={v} onChange={setV} min={0} max={600} step={10} histogram={histogram} format={(n) => `$${n}`} className="max-w-sm" />
    </div>
  );
}
