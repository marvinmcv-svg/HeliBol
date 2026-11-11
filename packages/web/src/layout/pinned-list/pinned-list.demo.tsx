"use client";
import { PinnedList } from "./pinned-list";

const items = [
  { id: "roadmap", title: "Q3 roadmap", subtitle: "Edited 2h ago", icon: "🗺️" },
  { id: "brand", title: "Brand guidelines", subtitle: "Shared with Design", icon: "🎨" },
  { id: "launch", title: "Launch checklist", subtitle: "12 of 18 done", icon: "🚀" },
  { id: "research", title: "Interview notes", subtitle: "Edited yesterday", icon: "📝" },
  { id: "okr", title: "Team OKRs", subtitle: "Edited last week", icon: "🎯" },
];

export default function Demo() {
  return (
    <div className="grid h-full place-items-start justify-center overflow-y-auto p-6">
      <PinnedList items={items} defaultPinned={["launch"]} />
    </div>
  );
}
