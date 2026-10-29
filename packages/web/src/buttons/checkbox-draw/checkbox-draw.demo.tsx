"use client";
import { CheckboxDraw } from "./checkbox-draw";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="w-72 space-y-3 rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-semibold">Launch checklist</p>
        <CheckboxDraw strike defaultChecked>Design tokens</CheckboxDraw>
        <CheckboxDraw strike>Reduced-motion fallbacks</CheckboxDraw>
        <CheckboxDraw strike>Ship it 🚀</CheckboxDraw>
      </div>
    </div>
  );
}
