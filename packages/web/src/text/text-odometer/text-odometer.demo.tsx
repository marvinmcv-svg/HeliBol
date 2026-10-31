"use client";
import { useEffect, useState } from "react";
import { TextOdometer } from "./text-odometer";

export default function Demo() {
  const [v, setV] = useState(1284903);
  useEffect(() => {
    const t = setInterval(() => setV((x) => x + Math.floor(Math.random() * 4800)), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-8">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Animations rendered today</p>
      <TextOdometer value={v} className="text-6xl font-semibold tracking-tight" />
      <TextOdometer value={v / 1000} format={{ style: "currency", currency: "USD", maximumFractionDigits: 2 }} className="text-xl text-emerald-500" />
    </div>
  );
}
