"use client";
import { useState } from "react";
import { TextareaAutosize } from "./textarea-autosize";

export default function Demo() {
  const [sent, setSent] = useState<string[]>([]);
  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center gap-4 p-6">
      <TextareaAutosize label="Leave feedback" placeholder="Type a few lines — the box grows with you…" maxLength={160} onSubmit={(v) => setSent((s) => [v, ...s].slice(0, 2))} />
      <ul className="space-y-1 text-xs text-muted-foreground" aria-live="polite">{sent.map((s, i) => <li key={i} className="truncate">Sent: {s}</li>)}</ul>
    </div>
  );
}
