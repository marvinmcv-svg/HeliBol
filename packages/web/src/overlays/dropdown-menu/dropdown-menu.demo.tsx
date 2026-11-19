"use client";
import { useState } from "react";
import { Copy, Pencil, Share2, Trash2 } from "lucide-react";
import { DropdownMenu } from "./dropdown-menu";

export default function Demo() {
  const [grid, setGrid] = useState(true);
  const [last, setLast] = useState("—");
  return (
    <div className="flex h-full flex-col items-center gap-4 p-8 pt-10">
      <DropdownMenu
        trigger="Actions"
        items={[
          { type: "label", label: "File" },
          { label: "Rename", icon: <Pencil className="size-4" />, shortcut: "⌘R", onSelect: () => setLast("Rename") },
          { label: "Duplicate", icon: <Copy className="size-4" />, shortcut: "⌘D", onSelect: () => setLast("Duplicate") },
          { label: "Share", icon: <Share2 className="size-4" />, onSelect: () => setLast("Share") },
          { type: "separator" },
          { type: "check", label: "Show grid", checked: grid, onCheckedChange: setGrid },
          { type: "separator" },
          { label: "Delete", icon: <Trash2 className="size-4" />, danger: true, onSelect: () => setLast("Delete") },
        ]}
      />
      <p className="mt-auto text-xs text-muted-foreground" aria-live="polite">Last action: {last} · grid {grid ? "on" : "off"}</p>
    </div>
  );
}
