"use client";
import { useState } from "react";
import { SuccessCheck } from "./success-check";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-6">
      <div className="flex gap-10" key={k}>
        <div className="flex flex-col items-center gap-2"><SuccessCheck status="success" /><p className="text-sm font-medium">Payment received</p></div>
        <div className="flex flex-col items-center gap-2"><SuccessCheck status="error" /><p className="text-sm font-medium">Upload failed</p></div>
      </div>
      <button onClick={() => setK((x) => x + 1)} className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent">Replay</button>
    </div>
  );
}
