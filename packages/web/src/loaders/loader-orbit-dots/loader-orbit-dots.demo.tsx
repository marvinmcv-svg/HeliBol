"use client";
import { DemoCenter } from "../../_demo";
import { LoaderOrbitDots } from "./loader-orbit-dots";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-6">
      <div className="flex items-center gap-10">
        <LoaderOrbitDots size={88} className="text-foreground" />
        <LoaderOrbitDots size={56} dots={6} color="#8b5cf6" />
        <LoaderOrbitDots size={36} dots={5} color="#06b6d4" />
      </div>
      <p className="text-sm text-muted-foreground">Calibrating…</p>
    </DemoCenter>
  );
}
