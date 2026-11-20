"use client";
import { DemoCenter } from "../../_demo";
import { TextCubeRotate } from "./text-cube-rotate";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-3 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Built for</p>
      <h3 className="text-6xl font-bold tracking-tight">
        <TextCubeRotate words={["DESIGNERS", "MAKERS", "STUDIOS", "TEAMS"]} className="bg-gradient-to-b from-violet-400 to-fuchsia-600 bg-clip-text text-transparent" />
      </h3>
    </DemoCenter>
  );
}
