"use client";
import { Bell, Search, Settings } from "lucide-react";
import { CursorSnapOutline } from "./cursor-snap-outline";

export default function Demo() {
  return (
    <CursorSnapOutline className="grid h-full place-items-center p-6">
      <div className="w-full max-w-md space-y-6">
        <nav className="flex items-center gap-1 rounded-2xl border border-border bg-card p-2">
          {["Home", "Projects", "Team", "Billing"].map((l) => <a key={l} href={`#${l}`} className="rounded-lg px-3 py-1.5 text-sm">{l}</a>)}
          <span className="ml-auto flex gap-1">
            {[Search, Bell, Settings].map((I, i) => <button key={i} aria-label={["Search", "Notifications", "Settings"][i]} className="grid size-8 place-items-center rounded-lg"><I className="size-4" /></button>)}
          </span>
        </nav>
        <div className="flex gap-3">
          <button className="flex-1 rounded-xl bg-foreground py-3 text-sm font-semibold text-background">Create project</button>
          <button className="rounded-xl border border-border px-4 py-3 text-sm">Import</button>
        </div>
        <p className="text-center text-xs text-muted-foreground">Glide over links and buttons — the cursor wraps them</p>
      </div>
    </CursorSnapOutline>
  );
}
