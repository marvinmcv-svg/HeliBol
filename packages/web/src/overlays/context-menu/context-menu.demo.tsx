"use client";
import { Copy, Download, Pencil, Share2, Trash2 } from "lucide-react";
import { ContextMenu } from "./context-menu";
export default function Demo() {
  return (
    <ContextMenu className="flex h-full w-full items-center justify-center p-6" actions={[{ label: "Rename", icon: <Pencil />, shortcut: "↵" }, { label: "Duplicate", icon: <Copy />, shortcut: "⌘D" }, { label: "Share", icon: <Share2 /> }, { label: "Download", icon: <Download /> }, { label: "Delete", icon: <Trash2 />, shortcut: "⌫", danger: true }]}>
      <div className="grid h-48 w-72 place-items-center rounded-2xl border-2 border-dashed border-border text-sm text-muted-foreground">Right-click (or Shift+F10) here</div>
    </ContextMenu>
  );
}
