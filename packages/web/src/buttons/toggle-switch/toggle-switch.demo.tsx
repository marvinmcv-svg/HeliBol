"use client";
import { ToggleSwitch } from "./toggle-switch";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="w-72 divide-y divide-border rounded-2xl border border-border bg-card">
        {[
          ["Push notifications", true],
          ["Weekly digest", false],
          ["Haptic feedback", true],
        ].map(([l, d]) => (
          <div key={l as string} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{l}</span>
            <ToggleSwitch defaultChecked={d as boolean} />
          </div>
        ))}
      </div>
    </div>
  );
}
