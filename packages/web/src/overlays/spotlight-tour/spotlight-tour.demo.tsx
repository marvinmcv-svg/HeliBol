"use client";
import { useRef, useState } from "react";
import { Bell, Plus, Search } from "lucide-react";
import { SpotlightTour } from "./spotlight-tour";

export default function Demo() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  return (
    <div ref={root} className="relative h-full overflow-hidden bg-background">
      <header className="flex items-center gap-3 border-b border-border px-5 py-3">
        <span className="font-semibold">Orbit</span>
        <div data-tour="search" className="ml-4 flex h-8 flex-1 items-center gap-2 rounded-lg border border-border px-2.5 text-sm text-muted-foreground"><Search className="size-3.5" /> Search projects</div>
        <button data-tour="bell" aria-label="Notifications" className="grid size-8 place-items-center rounded-lg border border-border"><Bell className="size-4" /></button>
      </header>
      <main className="grid grid-cols-3 gap-3 p-5">
        {["Website", "Mobile app", "Brand"].map((p) => <div key={p} className="h-24 rounded-xl border border-border bg-card p-3 text-sm font-medium">{p}</div>)}
        <button data-tour="new" className="flex h-24 items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground"><Plus className="size-4" /> New project</button>
      </main>
      {!open && <button onClick={() => setOpen(true)} className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm text-background">Restart tour</button>}
      <SpotlightTour
        root={root}
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          { target: "[data-tour=search]", title: "Find anything", body: "Search every project, file and comment from here." },
          { target: "[data-tour=new]", title: "Start a project", body: "Templates get you from zero to a shared board in seconds." },
          { target: "[data-tour=bell]", title: "Stay in the loop", body: "Mentions and reviews land here — nothing else." },
        ]}
      />
    </div>
  );
}
