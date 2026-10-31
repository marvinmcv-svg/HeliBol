"use client";
import { BgTopography } from "./bg-topography";
export default function Demo() {
  return (
    <BgTopography className="flex h-full w-full flex-col items-center justify-center bg-emerald-950/5 p-8 text-center dark:bg-emerald-950/30">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Elevation 2,431 m</p>
      <h2 className="mt-2 text-4xl font-semibold tracking-tight">Every trail, mapped.</h2>
    </BgTopography>
  );
}
