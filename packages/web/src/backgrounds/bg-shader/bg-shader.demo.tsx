"use client";
import { BgShader } from "./bg-shader";
const c: [string, string, string] = ["#0f172a", "#0891b2", "#a3e635"];
export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-3 p-3 sm:grid-cols-[1.5fr_1fr]">
      <BgShader className="flex items-end rounded-3xl p-6 text-white"><div><p className="text-xs opacity-70">WebGL · 1 KB</p><p className="text-2xl font-semibold">Liquid gradient shader</p></div></BgShader>
      <BgShader colors={c} className="rounded-3xl" />
    </div>
  );
}
