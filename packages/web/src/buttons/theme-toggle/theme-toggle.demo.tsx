"use client";
import { ThemeToggle } from "./theme-toggle";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <ThemeToggle className="size-16 rounded-2xl border border-border bg-card [&_svg]:size-7" />
      <p className="max-w-xs text-sm text-muted-foreground">Click it — the whole site switches theme with a circular reveal from the button (View Transitions API).</p>
    </div>
  );
}
