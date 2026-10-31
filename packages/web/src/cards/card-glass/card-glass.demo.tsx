"use client";
import { CardGlass } from "./card-glass";
export default function Demo() {
  return (
    <CardGlass className="h-full w-full bg-zinc-950">
      <div className="w-64">
        <p className="text-xs tracking-widest uppercase opacity-70">Balance</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">$12,840.22</p>
        <div className="mt-6 flex justify-between font-mono text-sm opacity-85"><span>•••• 4242</span><span>09/29</span></div>
      </div>
    </CardGlass>
  );
}
