"use client";
import { useState } from "react";
import { FileCode, Globe, Search, TestTube2 } from "lucide-react";
import { AiAgentSteps } from "./ai-agent-steps";
export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5">
        <AiAgentSteps key={k} steps={[
          { icon: <Search />, title: "Searching the registry", detail: "Found 12 matching components" },
          { icon: <Globe />, title: "Reading Motion docs", detail: "layoutId + AnimatePresence" },
          { icon: <FileCode />, title: "Writing pricing-toggle.tsx", detail: "+128 lines" },
          { icon: <TestTube2 />, title: "Running tests", detail: "426 passed" },
        ]} />
      </div>
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground hover:text-foreground">Replay</button>
    </div>
  );
}
