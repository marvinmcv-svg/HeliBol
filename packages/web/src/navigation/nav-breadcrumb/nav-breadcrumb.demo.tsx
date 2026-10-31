"use client";
import { useState } from "react";
import { NavBreadcrumb } from "./nav-breadcrumb";
const folders = ["Projects", "kinetik", "packages", "web", "src", "buttons"];
export default function Demo() {
  const [path, setPath] = useState(["Home", "Projects"]);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-6">
      <NavBreadcrumb path={path} onNavigate={(i) => setPath((p) => p.slice(0, i + 1))} />
      <div className="flex gap-2">
        <button onClick={() => setPath((p) => [...p, folders[(p.length - 1) % folders.length] + (p.length > 6 ? p.length : "")])} className="rounded-lg bg-foreground px-3 py-1.5 text-xs text-background">Open folder →</button>
        <button onClick={() => setPath((p) => (p.length > 1 ? p.slice(0, -1) : p))} className="rounded-lg border border-border px-3 py-1.5 text-xs">← Up</button>
      </div>
    </div>
  );
}
