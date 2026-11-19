"use client";
import { useState } from "react";
import { AiDiffReview } from "./ai-diff-review";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="mx-auto flex h-full max-w-lg flex-col gap-3 overflow-y-auto p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Agent: “Add reduced-motion support to the hero”</span>
        <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground underline underline-offset-4">Replay</button>
      </div>
      <AiDiffReview
        key={k}
        hunks={[
          {
            id: "1",
            file: "hero.tsx",
            summary: "respect prefers-reduced-motion",
            lines: [
              { type: "ctx", text: "export function Hero() {" },
              { type: "add", text: "  const reduced = useReducedMotion();" },
              { type: "del", text: "  const y = useTransform(p, [0, 1], [0, 200]);" },
              { type: "add", text: "  const y = useTransform(p, [0, 1], [0, reduced ? 0 : 200]);" },
              { type: "ctx", text: "  return <motion.h1 style={{ y }}>…</motion.h1>;" },
            ],
          },
          {
            id: "2",
            file: "globals.css",
            summary: "stop the marquee for reduced motion",
            lines: [
              { type: "add", text: "@media (prefers-reduced-motion: reduce) {" },
              { type: "add", text: "  .marquee { animation: none; }" },
              { type: "add", text: "}" },
            ],
          },
        ]}
      />
    </div>
  );
}
