"use client";
import { useState } from "react";
import { Bell } from "lucide-react";
import { DemoCenter } from "../../_demo";
import { BadgeAnimated } from "./badge-animated";

export default function Demo() {
  const [n, setN] = useState(3);
  return (
    <DemoCenter className="flex-col gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <BadgeAnimated variant="live" />
        <BadgeAnimated variant="shine">Pro</BadgeAnimated>
        <BadgeAnimated variant="status" status="online">Ava is online</BadgeAnimated>
        <BadgeAnimated variant="status" status="busy" />
      </div>
      <button onClick={() => setN((x) => x + 1)} className="relative grid size-11 place-items-center rounded-xl border border-border" aria-label="Add notification">
        <Bell className="size-5" />
        <BadgeAnimated variant="count" count={n} className="absolute -right-1.5 -top-1.5" />
      </button>
      <p className="text-xs text-muted-foreground">Click the bell to bump the counter</p>
    </DemoCenter>
  );
}
