"use client";
import { useEffect, useState } from "react";
import { TextSplitFlap } from "./text-split-flap";

const rows = [["LISBON", "12:40", "BOARDING"], ["TOKYO", "13:05", "ON TIME"], ["NEW YORK", "13:50", "DELAYED"]];
const alt = [["BERLIN", "12:55", "GATE 4"], ["SEOUL", "13:20", "ON TIME"], ["LIMA", "14:10", "FINAL CALL"]];

export default function Demo() {
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setFlip((f) => !f), 4200);
    return () => clearInterval(t);
  }, []);
  const data = flip ? alt : rows;
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-950 p-6">
      <div className="space-y-2 rounded-2xl border border-white/10 bg-black p-4 text-[15px]">
        <p className="mb-2 text-xs tracking-[0.3em] text-white/40">DEPARTURES</p>
        {data.map((r, i) => (
          <div key={i} className="flex gap-4">
            <TextSplitFlap value={r[0].padEnd(8)} />
            <TextSplitFlap value={r[1]} />
            <TextSplitFlap value={r[2].padEnd(10)} cellClassName={r[2].includes("DELAY") || r[2].includes("FINAL") ? "text-rose-400" : undefined} />
          </div>
        ))}
      </div>
    </div>
  );
}
