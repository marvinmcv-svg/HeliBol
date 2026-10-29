"use client";
import { useState } from "react";
import { Phone, PhoneOff, Timer } from "lucide-react";
import { DynamicIsland, type IslandState } from "./dynamic-island";

const states: Record<string, IslandState> = {
  idle: { id: "idle", size: { width: 120, height: 34 }, content: null },
  ring: {
    id: "ring",
    size: { width: 340, height: 76 },
    radius: 38,
    content: (
      <div className="flex h-full items-center gap-3 px-3">
        <img src="/demo/photo-8.jpg" alt="" className="size-12 rounded-full object-cover" />
        <div className="flex-1"><p className="text-[11px] text-white/60">mobile</p><p className="text-sm font-semibold">Maya Chen</p></div>
        <span className="grid size-11 place-items-center rounded-full bg-red-500"><PhoneOff className="size-5" /></span>
        <span className="grid size-11 place-items-center rounded-full bg-green-500"><Phone className="size-5" /></span>
      </div>
    ),
  },
  music: {
    id: "music",
    size: { width: 360, height: 150 },
    radius: 42,
    content: (
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex items-center gap-3">
          <img src="/demo/photo-6.jpg" alt="" className="size-12 rounded-xl object-cover" />
          <div className="flex-1"><p className="text-sm font-semibold">Aurora Drive</p><p className="text-xs text-white/60">Northern Lights</p></div>
          <div className="flex h-5 items-end gap-0.5">{[0, 1, 2, 3].map((i) => <span key={i} className="w-1 animate-pulse rounded-full bg-emerald-400" style={{ height: `${40 + i * 15}%`, animationDelay: `${i * 120}ms` }} />)}</div>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/20"><div className="h-full w-2/5 rounded-full bg-white" /></div>
      </div>
    ),
  },
  timer: {
    id: "timer",
    size: { width: 220, height: 34 },
    content: (
      <div className="flex h-full items-center justify-between px-3 text-xs">
        <Timer className="size-4 text-amber-400" />
        <span className="font-mono text-amber-400 tabular-nums">04:59</span>
      </div>
    ),
  },
};

export default function Demo() {
  const [s, setS] = useState("idle");
  return (
    <div className="flex h-full flex-col items-center justify-between p-6">
      <div className="h-[160px] pt-2"><DynamicIsland state={states[s]} /></div>
      <div className="flex flex-wrap justify-center gap-2">
        {Object.keys(states).map((k) => (
          <button key={k} onClick={() => setS(k)} aria-pressed={s === k} className="rounded-full border border-border px-3 py-1 text-xs capitalize aria-pressed:bg-foreground aria-pressed:text-background">{k}</button>
        ))}
      </div>
    </div>
  );
}
