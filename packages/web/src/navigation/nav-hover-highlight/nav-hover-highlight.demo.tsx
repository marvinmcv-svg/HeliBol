"use client";
import { NavHoverHighlight } from "./nav-hover-highlight";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center p-6"><NavHoverHighlight className="rounded-full border border-border bg-card p-1" items={["Product", "Solutions", "Developers", "Pricing", "Blog"].map((l) => ({ label: l, href: `#${l.toLowerCase()}` }))} /></div>;
}
