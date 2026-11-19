"use client";
import { ChartRadialBars } from "./chart-radial-bars";

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-6">
      <ChartRadialBars
        centerLabel="Signups this week"
        data={[
          { label: "Organic", value: 86, color: "#a78bfa" },
          { label: "Referral", value: 64, color: "#22d3ee" },
          { label: "Paid", value: 41, color: "#f472b6" },
          { label: "Partners", value: 27, color: "#facc15" },
        ]}
      />
    </div>
  );
}
