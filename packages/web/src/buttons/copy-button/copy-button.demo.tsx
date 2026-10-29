"use client";
import { CopyButton } from "./copy-button";

export default function Demo() {
  const cmd = "npx shadcn@latest add kinetik/like-burst";
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card py-2 pr-2 pl-4 font-mono text-sm">
        <span className="text-muted-foreground">$</span>
        <span className="truncate">{cmd}</span>
        <CopyButton value={cmd} />
      </div>
    </div>
  );
}
