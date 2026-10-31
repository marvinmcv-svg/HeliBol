"use client";
import { CursorClickSpark } from "./cursor-click-spark";
export default function Demo() {
  return (
    <CursorClickSpark className="grid h-full w-full place-items-center">
      <p className="text-center text-sm text-muted-foreground">Click anywhere ✦<br /><span className="text-2xl font-semibold text-foreground">Sparks fly</span></p>
    </CursorClickSpark>
  );
}
