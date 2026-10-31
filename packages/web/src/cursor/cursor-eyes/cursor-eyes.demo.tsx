"use client";
import { CursorEyes } from "./cursor-eyes";
export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
      <CursorEyes />
      <p className="text-sm text-muted-foreground">I&apos;m watching your cursor 👀</p>
    </div>
  );
}
