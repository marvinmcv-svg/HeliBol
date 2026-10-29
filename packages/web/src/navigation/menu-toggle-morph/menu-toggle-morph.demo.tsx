"use client";
import { MenuToggleMorph } from "./menu-toggle-morph";

export default function Demo() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <span className="font-semibold">Studio®</span>
        <MenuToggleMorph contained links={[{ label: "Work", href: "#" }, { label: "Studio", href: "#" }, { label: "Journal", href: "#" }, { label: "Contact", href: "#" }]} />
      </div>
      <div className="grid h-[70%] place-items-center text-sm text-muted-foreground">Tap the menu icon ↗</div>
    </div>
  );
}
