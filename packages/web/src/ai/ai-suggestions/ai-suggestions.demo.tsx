"use client";
import { useState } from "react";
import { AiSuggestions } from "./ai-suggestions";
export default function Demo() {
  const [picked, setPicked] = useState("");
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">{picked || "Pick a suggestion…"}</div>
      <AiSuggestions onPick={setPicked} className="max-w-lg" items={[{ icon: "🎨", label: "Design a pricing page" }, { icon: "⚡", label: "Add a spring to my tabs" }, { icon: "📱", label: "Build an onboarding flow" }, { icon: "🧪", label: "Write tests for this" }, { icon: "♿", label: "Audit reduced motion" }]} />
    </div>
  );
}
