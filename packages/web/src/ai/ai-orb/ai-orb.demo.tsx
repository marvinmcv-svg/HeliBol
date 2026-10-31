"use client";
import { useEffect, useState } from "react";
import { AiOrb, type OrbState } from "./ai-orb";
const states: OrbState[] = ["idle", "listening", "thinking", "speaking"];
export default function Demo() {
  const [s, setS] = useState<OrbState>("listening");
  const [lv, setLv] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setLv(Math.random()), 160);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black p-6">
      <AiOrb state={s} level={lv} size={220} />
      <div className="flex gap-1.5">{states.map((x) => <button key={x} onClick={() => setS(x)} aria-pressed={s === x} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 capitalize aria-pressed:bg-white aria-pressed:text-black">{x}</button>)}</div>
    </div>
  );
}
