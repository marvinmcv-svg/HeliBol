"use client";
import { useState } from "react";
import { Plane } from "lucide-react";
import { CardTicketTear } from "./card-ticket-tear";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-start gap-3 overflow-hidden p-6 pt-8">
      <CardTicketTear
        key={k}
        stub={
          <div className="flex items-end justify-between">
            <div><p className="text-[10px] uppercase tracking-widest text-muted-foreground">Seat</p><p className="text-2xl font-bold">14A</p></div>
            <div className="text-right"><p className="text-[10px] uppercase tracking-widest text-muted-foreground">Boarding</p><p className="text-2xl font-bold">09:40</p></div>
          </div>
        }
      >
        <div className="flex items-center justify-between">
          <div><p className="text-3xl font-black tracking-tight">LIS</p><p className="text-xs text-muted-foreground">Lisbon</p></div>
          <Plane className="size-5 text-muted-foreground" />
          <div className="text-right"><p className="text-3xl font-black tracking-tight">CPH</p><p className="text-xs text-muted-foreground">Copenhagen</p></div>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">Flight KN 207 · Gate B12 · 21 Nov</p>
      </CardTicketTear>
      <button onClick={() => setK((x) => x + 1)} className="mt-auto text-xs text-muted-foreground underline underline-offset-4">New ticket</button>
    </div>
  );
}
