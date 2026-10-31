"use client";
import { AiPromptBox } from "./ai-prompt-box";
export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <h2 className="text-2xl font-semibold tracking-tight">What should we build?</h2>
      <AiPromptBox placeholder="Describe a component… (Enter to send, Shift+Enter for newline)" />
    </div>
  );
}
