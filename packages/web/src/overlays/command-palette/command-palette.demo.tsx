"use client";
import { useState } from "react";
import { Calendar, FilePlus, Moon, Rocket, Settings, User } from "lucide-react";
import { CommandPalette } from "./command-palette";
export default function Demo() {
  const [open, setOpen] = useState(true);
  return (
    <div className="relative h-full w-full overflow-hidden [contain:paint]">
      <div className="grid h-full place-items-center"><button onClick={() => setOpen(true)} className="rounded-xl border border-border bg-card px-4 py-2 text-sm">Open palette <kbd className="ml-2 text-xs text-muted-foreground">⌘K</kbd></button></div>
      <CommandPalette open={open} onOpenChange={setOpen} commands={[
        { id: "1", label: "New document", group: "Create", icon: <FilePlus />, shortcut: "⌘N" },
        { id: "2", label: "Schedule meeting", group: "Create", icon: <Calendar /> },
        { id: "3", label: "Deploy to production", group: "Actions", icon: <Rocket />, shortcut: "⌘⇧D" },
        { id: "4", label: "Toggle dark mode", group: "Actions", icon: <Moon /> },
        { id: "5", label: "Profile", group: "Navigate", icon: <User /> },
        { id: "6", label: "Settings", group: "Navigate", icon: <Settings />, shortcut: "⌘," },
      ]} />
    </div>
  );
}
