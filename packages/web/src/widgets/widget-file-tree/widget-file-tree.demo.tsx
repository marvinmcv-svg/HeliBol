"use client";
import { WidgetFileTree } from "./widget-file-tree";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <WidgetFileTree tree={[
        { name: "app", children: [{ name: "layout.tsx" }, { name: "page.tsx" }, { name: "pricing", children: [{ name: "page.tsx" }] }] },
        { name: "components", children: [{ name: "kinetik", children: [{ name: "like-burst.tsx" }, { name: "toast-stack.tsx" }] }, { name: "ui", children: [{ name: "button.tsx" }] }] },
        { name: "lib", children: [{ name: "kinetik", children: [{ name: "tokens.ts" }, { name: "core.ts" }] }] },
        { name: "package.json" },
      ]} />
    </div>
  );
}
