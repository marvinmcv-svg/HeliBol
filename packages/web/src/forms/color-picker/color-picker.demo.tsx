"use client";
import { useState } from "react";
import { ColorPicker } from "./color-picker";

export default function Demo() {
  const [c, setC] = useState("#8b5cf6");
  return (
    <div className="flex h-full flex-wrap items-center justify-center gap-8 p-6">
      <ColorPicker value={c} onChange={setC} label="Brand colour" />
      <div className="w-56 space-y-3">
        <button className="h-10 w-full rounded-xl text-sm font-semibold text-white shadow-lg transition-colors" style={{ background: c, boxShadow: `0 10px 30px -10px ${c}` }}>Primary button</button>
        <div className="rounded-xl border p-3 text-sm" style={{ borderColor: c }}>
          <span className="font-semibold" style={{ color: c }}>Accent text</span> follows the picker.
        </div>
      </div>
    </div>
  );
}
