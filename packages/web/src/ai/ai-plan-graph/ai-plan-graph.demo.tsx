"use client";
import { useState } from "react";
import { AiPlanGraph } from "./ai-plan-graph";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center gap-3 overflow-y-auto p-5">
      <AiPlanGraph
        key={k}
        goal="Launch the spring campaign"
        steps={[
          { id: "a", title: "Research the audience", children: [{ id: "a1", title: "Pull last quarter's cohorts" }, { id: "a2", title: "Summarise 12 interviews" }] },
          { id: "b", title: "Draft the landing page", children: [{ id: "b1", title: "Write hero copy" }, { id: "b2", title: "Pick a template" }, { id: "b3", title: "Generate visuals" }] },
          { id: "c", title: "Schedule the emails", children: [{ id: "c1", title: "Segment the list" }, { id: "c2", title: "Queue 3 sends" }] },
        ]}
      />
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground underline underline-offset-4">Run again</button>
    </div>
  );
}
