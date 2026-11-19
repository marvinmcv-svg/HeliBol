"use client";
import { SvgWaveDivider } from "./svg-wave-divider";

export default function Demo() {
  return (
    <div className="flex h-full flex-col">
      <section className="grid flex-1 place-items-center bg-gradient-to-b from-indigo-950 to-violet-900 text-white">
        <h3 className="text-3xl font-semibold tracking-tight">Section one</h3>
      </section>
      <div className="bg-violet-900">
        <SvgWaveDivider height={110} />
      </div>
      <section className="grid flex-1 place-items-center bg-background">
        <h3 className="text-3xl font-semibold tracking-tight">Section two</h3>
      </section>
    </div>
  );
}
