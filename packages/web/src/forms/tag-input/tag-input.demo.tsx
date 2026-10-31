"use client";
import { TagInput } from "./tag-input";
export default function Demo() {
  return <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6"><TagInput defaultTags={["motion", "spring", "gsap"]} /><p className="text-xs text-muted-foreground">Enter/comma adds · Backspace twice removes · duplicates wiggle</p></div>;
}
