"use client";
import { useState } from "react";
import { DrawerDraggable } from "./drawer-draggable";

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-8">
      <button onClick={() => setOpen(true)} className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background">Share project</button>
      <DrawerDraggable contained open={open} onOpenChange={setOpen} title="Share">
        <p className="text-sm text-muted-foreground">Drag the handle down (or flick it) to dismiss. Esc and the backdrop work too.</p>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {["Copy link", "Email", "Slack", "Export"].map((l, i) => (
            <button key={l} className="flex flex-col items-center gap-1.5 text-xs">
              <span className="size-12 rounded-2xl" style={{ background: `oklch(0.7 0.15 ${i * 80 + 20})` }} />
              {l}
            </button>
          ))}
        </div>
      </DrawerDraggable>
    </div>
  );
}
