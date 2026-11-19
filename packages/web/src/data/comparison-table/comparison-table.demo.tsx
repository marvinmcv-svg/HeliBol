"use client";
import { ComparisonTable } from "./comparison-table";

export default function Demo() {
  return (
    <div className="h-full overflow-y-auto p-5">
      <ComparisonTable
        plans={[
          { id: "free", name: "Free", price: "$0" },
          { id: "pro", name: "Pro", price: "$12/mo", highlight: true },
          { id: "team", name: "Team", price: "$40/mo" },
        ]}
        rows={[
          { group: "Library", feature: "Components", values: { free: "120", pro: "All 330+", team: "All 330+" } },
          { feature: "Templates", values: { free: false, pro: true, team: true } },
          { feature: "Mobile flows (Expo)", values: { free: false, pro: true, team: true } },
          { group: "Workflow", feature: "AI prompts", values: { free: true, pro: true, team: true } },
          { feature: "MCP install", values: { free: true, pro: true, team: true } },
          { feature: "Shared collections", values: { free: false, pro: false, team: true } },
          { feature: "Priority support", values: { free: false, pro: false, team: true } },
        ]}
      />
    </div>
  );
}
