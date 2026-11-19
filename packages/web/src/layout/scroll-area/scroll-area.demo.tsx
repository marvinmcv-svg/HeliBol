"use client";
import { ScrollArea } from "./scroll-area";

const releases = Array.from({ length: 24 }, (_, i) => ({ v: `v2.${24 - i}.0`, note: ["Faster thumbnails", "New three.js scenes", "Saved collections", "MCP install docs", "Mobile filter drawer", "OG images"][i % 6] }));

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-6">
      <ScrollArea label="Release notes" className="h-72 w-64 rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {releases.map((r) => (
            <li key={r.v} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-mono text-xs text-muted-foreground">{r.v}</span>
              <span>{r.note}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
