"use client";
import { useState } from "react";
import { AiThinking } from "./ai-thinking";
export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <AiThinking key={k} steps={["Reading the master plan…", "Comparing 7 motion libraries…", "Choosing the right engine…", "Drafting the component…"]} />
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground hover:text-foreground">Replay</button>
    </div>
  );
}
