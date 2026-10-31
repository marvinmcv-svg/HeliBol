"use client";
import { useState } from "react";
import { RatingStars } from "./rating-stars";
export default function Demo() {
  const [v, setV] = useState(4);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8">
      <p className="text-sm font-medium">How was your order?</p>
      <RatingStars value={v} onChange={setV} />
      <p className="text-xs text-muted-foreground">{["Tap a star", "Awful", "Meh", "Okay", "Great", "Perfect!"][v]}</p>
    </div>
  );
}
