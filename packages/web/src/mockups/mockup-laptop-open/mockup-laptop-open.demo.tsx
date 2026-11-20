"use client";
import { useState } from "react";
import { photos } from "../../_demo";
import { MockupLaptopOpen } from "./mockup-laptop-open";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <MockupLaptopOpen key={k}>
        <div className="flex size-full">
          <aside className="w-1/4 space-y-1.5 bg-zinc-900 p-2">{[0, 1, 2, 3].map((i) => <div key={i} className="h-2 rounded bg-zinc-700" style={{ width: `${80 - i * 12}%` }} />)}</aside>
          <main className="flex-1 bg-zinc-950 p-2">
            <img src={photos[2]} alt="" className="h-1/2 w-full rounded object-cover" />
            <div className="mt-2 grid grid-cols-3 gap-1.5">{[0, 1, 2].map((i) => <div key={i} className="h-8 rounded bg-zinc-800" />)}</div>
          </main>
        </div>
      </MockupLaptopOpen>
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground underline underline-offset-4">Close & reopen</button>
    </div>
  );
}
