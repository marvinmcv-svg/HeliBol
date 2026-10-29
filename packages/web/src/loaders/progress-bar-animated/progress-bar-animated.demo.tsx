"use client";
import { useEffect, useState } from "react";
import { ProgressBarAnimated } from "./progress-bar-animated";

export default function Demo() {
  const [v, setV] = useState(12);
  useEffect(() => {
    const id = setInterval(() => setV((x) => (x >= 100 ? 8 : Math.min(100, x + Math.random() * 22))), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 p-8">
      <div className="space-y-2"><div className="flex justify-between text-xs"><span>Uploading assets</span><span className="tabular-nums text-muted-foreground">{Math.round(v)}%</span></div><ProgressBarAnimated value={v} className="text-violet-500" /></div>
      <div className="space-y-2"><p className="text-xs">Striped</p><ProgressBarAnimated value={v} striped className="h-3 text-emerald-500" /></div>
      <div className="space-y-2"><p className="text-xs">Indeterminate</p><ProgressBarAnimated className="text-sky-500" /></div>
    </div>
  );
}
