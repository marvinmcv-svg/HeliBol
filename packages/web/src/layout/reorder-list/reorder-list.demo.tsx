"use client";
import { useState } from "react";
import { ReorderList } from "./reorder-list";

const initial = [
  { id: "1", title: "Design review", tag: "Today", color: "bg-violet-500" },
  { id: "2", title: "Ship onboarding flow", tag: "Tomorrow", color: "bg-emerald-500" },
  { id: "3", title: "Write release notes", tag: "Fri", color: "bg-amber-500" },
  { id: "4", title: "Customer interviews", tag: "Next week", color: "bg-sky-500" },
];

export default function Demo() {
  const [items, setItems] = useState(initial);
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <ReorderList
        className="w-full max-w-sm"
        items={items}
        onReorder={setItems}
        render={(it) => (
          <div className="flex items-center gap-2">
            <span className={`size-2 rounded-full ${it.color}`} />
            <span className="truncate text-sm font-medium">{it.title}</span>
            <span className="ml-auto text-xs text-muted-foreground">{it.tag}</span>
          </div>
        )}
      />
    </div>
  );
}
