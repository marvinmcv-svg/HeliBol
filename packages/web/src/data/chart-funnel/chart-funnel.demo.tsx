"use client";
import { DemoCenter } from "../../_demo";
import { ChartFunnel } from "./chart-funnel";

export default function Demo() {
  return (
    <DemoCenter>
      <ChartFunnel
        title="Signup funnel · last 30 days"
        stages={[
          { label: "Visited", value: 48200 },
          { label: "Viewed pricing", value: 21400 },
          { label: "Started trial", value: 8350 },
          { label: "Activated", value: 4920 },
          { label: "Paid", value: 1870 },
        ]}
      />
    </DemoCenter>
  );
}
