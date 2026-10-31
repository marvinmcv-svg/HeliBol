"use client";
import { PopoverMorph } from "./popover-morph";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <PopoverMorph label="Feedback" title="Feedback">
        {(close) => (
          <form onSubmit={(e) => (e.preventDefault(), close())} className="space-y-2">
            <textarea autoFocus rows={3} placeholder="What could be better?" className="w-full resize-none rounded-xl border border-input bg-background p-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40" />
            <div className="flex justify-end gap-2"><button type="button" onClick={close} className="rounded-lg px-3 py-1.5 text-xs hover:bg-accent">Cancel</button><button className="rounded-lg bg-foreground px-3 py-1.5 text-xs text-background">Send</button></div>
          </form>
        )}
      </PopoverMorph>
    </div>
  );
}
