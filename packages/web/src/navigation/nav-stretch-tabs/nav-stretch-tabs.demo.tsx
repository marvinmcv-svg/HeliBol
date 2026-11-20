"use client";
import { DemoCenter } from "../../_demo";
import { NavStretchTabs } from "./nav-stretch-tabs";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-5">
      <NavStretchTabs tabs={["Overview", "Analytics", "Reports", "Settings"]} defaultIndex={1} />
      <NavStretchTabs tabs={["Day", "Week", "Month", "Year"]} className="scale-90" />
      <p className="text-xs text-muted-foreground">Jump far — the pill stretches, then catches up</p>
    </DemoCenter>
  );
}
