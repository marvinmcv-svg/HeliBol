"use client";
import { Bold, Italic, Link2, Underline } from "lucide-react";
import { TooltipAnimated } from "./tooltip-animated";

export default function Demo() {
  const tools = [
    { icon: Bold, label: "Bold", k: "⌘B" },
    { icon: Italic, label: "Italic", k: "⌘I" },
    { icon: Underline, label: "Underline", k: "⌘U" },
    { icon: Link2, label: "Link", k: "⌘K" },
  ];
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        {tools.map((t) => (
          <TooltipAnimated key={t.label} content={<span className="flex gap-2">{t.label}<kbd className="opacity-60">{t.k}</kbd></span>}>
            <button aria-label={t.label} className="grid size-9 place-items-center rounded-lg hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"><t.icon className="size-4" /></button>
          </TooltipAnimated>
        ))}
      </div>
    </div>
  );
}
