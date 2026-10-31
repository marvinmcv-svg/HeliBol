"use client";
import { MockupWindow } from "./mockup-window";
export default function Demo() {
  return (
    <div className="h-full w-full p-6">
      <MockupWindow title="Notes" icon="📝">
        <p className="font-semibold">Ideas for kinetik 3.0</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground"><li>Physics playground</li><li>Native Expo gallery</li><li>MCP server</li></ul>
        <p className="mt-3 text-xs text-muted-foreground">Click a red/yellow light, then the dock icon.</p>
      </MockupWindow>
    </div>
  );
}
