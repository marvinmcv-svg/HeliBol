"use client";
import { useState } from "react";
import { SvgSignature } from "./svg-signature";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 bg-[#fbf8f1] p-8 text-zinc-900">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Approved by</p>
        <SvgSignature key={k} className="mt-3 text-indigo-900" label="Signature of the studio director" />
        <div className="mt-2 flex justify-between border-t border-zinc-200 pt-2 text-xs text-zinc-500"><span>Studio Director</span><span>19 Nov 2026</span></div>
      </div>
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-zinc-500 underline underline-offset-4">Sign again</button>
    </div>
  );
}
