"use client";
import { BgCaustics } from "./bg-caustics";

export default function Demo() {
  return (
    <BgCaustics className="grid h-full place-items-center text-white">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-100/80">Summer house · Algarve</p>
        <h3 className="mt-2 text-4xl font-semibold tracking-tight [text-shadow:0_2px_24px_rgb(0_0_0/.35)] sm:text-5xl">Dive in slowly.</h3>
      </div>
    </BgCaustics>
  );
}
