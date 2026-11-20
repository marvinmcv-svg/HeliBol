"use client";
import { DemoCenter } from "../../_demo";
import { IconBell, IconCopy, IconHeart, IconMenu, IconPlay, IconTheme } from "./svg-icon-set";

export default function Demo() {
  const items = [
    ["Menu", <IconMenu key="m" />],
    ["Play", <IconPlay key="p" />],
    ["Like", <IconHeart key="h" />],
    ["Bell", <IconBell key="b" />],
    ["Copy", <IconCopy key="c" />],
    ["Theme", <IconTheme key="t" />],
  ] as const;
  return (
    <DemoCenter className="flex-col gap-5">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {items.map(([name, icon]) => (
          <div key={name} className="flex flex-col items-center gap-1.5 rounded-2xl border bg-card p-3">
            {icon}
            <span className="text-[11px] text-muted-foreground">{name}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Click each icon to toggle its state</p>
    </DemoCenter>
  );
}
