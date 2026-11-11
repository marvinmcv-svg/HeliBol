"use client";
import { useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { photoAlt, photos } from "../../_demo";
import { ViewSwitch, type ViewMode } from "./view-switch";

export default function Demo() {
  const [view, setView] = useState<ViewMode>("cards");
  const grid = view === "cards" ? "grid-cols-3" : "grid-cols-1";
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Library</h3>
        <ViewSwitch value={view} onChange={setView} />
      </div>
      <LayoutGroup>
        <div className={`grid gap-2 overflow-hidden ${grid}`}>
          {photos.slice(0, 6).map((p, i) => (
            <motion.div layout key={p} transition={{ type: "spring", stiffness: 300, damping: 30 }} className={`flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-card ${view === "cards" ? "flex-col p-0" : "p-1.5"}`}>
              <motion.img layout src={p} alt="" className={view === "cards" ? "aspect-[4/3] w-full object-cover" : view === "list" ? "size-10 rounded-lg object-cover" : "size-6 rounded object-cover"} />
              <motion.span layout="position" className={`text-sm ${view === "cards" ? "pb-2" : ""}`}>{photoAlt[i]}</motion.span>
            </motion.div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
