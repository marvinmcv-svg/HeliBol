"use client";
import { ArrowUpRight } from "lucide-react";
import { DemoCenter } from "../../_demo";
import { ButtonDirectionalFill } from "./button-directional-fill";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-5">
      <ButtonDirectionalFill className="text-foreground">Start a project <ArrowUpRight className="size-4" /></ButtonDirectionalFill>
      <div className="flex gap-3">
        <ButtonDirectionalFill fill="#a3e635" fillText="#111" className="text-lime-500">Book a call</ButtonDirectionalFill>
        <ButtonDirectionalFill fill="#f472b6" fillText="#111" className="text-pink-400">Showreel</ButtonDirectionalFill>
      </div>
      <p className="text-xs text-muted-foreground">Enter from different sides — the fill follows</p>
    </DemoCenter>
  );
}
