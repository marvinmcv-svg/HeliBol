"use client";
import { photos } from "../../_demo";
import { MockupPhone3D } from "./mockup-phone-3d";

export default function Demo() {
  return (
    <div className="grid h-full place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#27272a,#09090b_70%)]">
      <MockupPhone3D className="scale-[0.8]">
        <div className="flex h-full flex-col bg-white text-zinc-900">
          <img src={photos[5]} alt="" className="h-1/2 w-full object-cover" />
          <div className="space-y-2 p-4">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400">Tonight</p>
            <p className="text-lg font-semibold leading-tight">Aurora forecast: strong</p>
            <p className="text-xs text-zinc-500">Kp 6 · clear skies after 22:00</p>
            <div className="mt-3 h-1.5 rounded-full bg-zinc-100"><div className="h-full w-4/5 rounded-full bg-violet-500" /></div>
          </div>
        </div>
      </MockupPhone3D>
    </div>
  );
}
