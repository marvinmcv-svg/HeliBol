"use client";
import { useState } from "react";
import { DialogAnimated } from "./dialog-animated";

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <button onClick={() => setOpen(true)} className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background">Invite teammates</button>
      <DialogAnimated open={open} onOpenChange={setOpen} title="Invite your team" description="They'll get access to every component and collection.">
        <form method="dialog" className="space-y-3" onSubmit={() => setOpen(false)}>
          <input autoFocus placeholder="name@company.com" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-accent">Cancel</button>
            <button className="rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background">Send invite</button>
          </div>
        </form>
      </DialogAnimated>
    </div>
  );
}
