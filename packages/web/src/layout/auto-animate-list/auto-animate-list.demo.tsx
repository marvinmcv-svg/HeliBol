"use client";
import { useState } from "react";
import { Plus, Shuffle, X } from "lucide-react";
import { AutoAnimateList } from "./auto-animate-list";

const names = ["Ava", "Kai", "Noor", "Leo", "Mila", "Ezra", "Zoe", "Ivan", "Luna", "Omar"];
const hues = [262, 330, 24, 160, 200, 45];
let n = 4;

export default function Demo() {
  const [items, setItems] = useState(names.slice(0, 4).map((name, i) => ({ id: String(i), name, hue: hues[i] })));
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <div className="flex gap-2">
        <button onClick={() => { const i = n++; setItems((s) => [{ id: String(i), name: names[i % names.length], hue: hues[i % hues.length] }, ...s]); }} className="inline-flex items-center gap-1 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background"><Plus className="size-3.5" />Add</button>
        <button onClick={() => setItems((s) => [...s].sort(() => Math.random() - 0.5))} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium"><Shuffle className="size-3.5" />Shuffle</button>
      </div>
      <AutoAnimateList
        className="w-full max-w-xs space-y-2"
        items={items}
        getKey={(i) => i.id}
        itemClassName="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
        render={(it) => (
          <>
            <span className="grid size-8 place-items-center rounded-full text-xs font-semibold text-white" style={{ background: `oklch(0.65 0.18 ${it.hue})` }}>{it.name[0]}</span>
            <span className="flex-1 text-sm font-medium">{it.name}</span>
            <button onClick={() => setItems((s) => s.filter((x) => x.id !== it.id))} aria-label={`Remove ${it.name}`} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-accent"><X className="size-3.5" /></button>
          </>
        )}
      />
    </div>
  );
}
