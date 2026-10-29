"use client";
import { StatCounterGrid } from "./stat-counter-grid";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center p-6">
      <StatCounterGrid
        className="w-full"
        stats={[
          { label: "Revenue", value: 48210, prefix: "$", delta: 12.4, spark: [4, 6, 5, 8, 7, 9, 12, 11, 14] },
          { label: "Active users", value: 9284, delta: 4.1, spark: [5, 5, 6, 7, 6, 8, 8, 9, 10] },
          { label: "Churn", value: 2.3, suffix: "%", decimals: 1, delta: -0.6, spark: [9, 8, 8, 7, 6, 6, 5, 4, 4] },
          { label: "NPS", value: 71, delta: 3, spark: [5, 6, 6, 7, 8, 7, 8, 9, 9] },
        ]}
      />
    </div>
  );
}
