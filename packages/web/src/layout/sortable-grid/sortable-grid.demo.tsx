"use client";
import { SortableGrid } from "./sortable-grid";

const apps = [
  ["Mail", "#3b82f6", "✉️"], ["Photos", "#f59e0b", "🌄"], ["Music", "#ef4444", "🎵"], ["Maps", "#22c55e", "🗺️"],
  ["Notes", "#eab308", "📝"], ["Camera", "#64748b", "📷"], ["Weather", "#0ea5e9", "⛅"], ["Clock", "#18181b", "⏰"],
].map(([label, bg, icon]) => ({
  id: label,
  label,
  content: (
    <div className="grid size-full place-items-center rounded-2xl text-3xl shadow-sm" style={{ background: `linear-gradient(160deg, ${bg}, color-mix(in oklab, ${bg} 70%, black))` }}>
      <span aria-hidden>{icon}</span>
      <span className="absolute -bottom-5 text-[11px] text-muted-foreground">{label}</span>
    </div>
  ),
}));

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className="w-full max-w-xs space-y-8">
        <SortableGrid items={apps} />
        <p className="pt-4 text-center text-xs text-muted-foreground">Drag icons to rearrange · or focus + Space + arrows</p>
      </div>
    </div>
  );
}
