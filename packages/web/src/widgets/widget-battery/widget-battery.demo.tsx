"use client";
import { useEffect, useState } from "react";
import { WidgetBattery } from "./widget-battery";
export default function Demo() {
  const [l, setL] = useState(14);
  useEffect(() => {
    const t = setInterval(() => setL((x) => (x >= 100 ? 14 : x + 3)), 400);
    return () => clearInterval(t);
  }, []);
  return <div className="flex h-full w-full items-center justify-center gap-4 p-6"><WidgetBattery level={l} charging /><WidgetBattery level={18} label="AirPods" className="hidden sm:flex" /></div>;
}
