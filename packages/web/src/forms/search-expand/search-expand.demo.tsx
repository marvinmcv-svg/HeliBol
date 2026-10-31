"use client";
import { SearchExpand } from "./search-expand";
export default function Demo() {
  return <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6"><SearchExpand placeholder="Search 180+ components…" /><p className="text-xs text-muted-foreground">Click the icon or press /</p></div>;
}
