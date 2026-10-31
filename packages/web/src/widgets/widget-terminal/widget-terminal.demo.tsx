"use client";
import { WidgetTerminal } from "./widget-terminal";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <WidgetTerminal className="w-full max-w-lg" lines={[
        { cmd: "npx shadcn@latest add kinetik/like-burst" },
        { out: "✔ Checking registry.", tone: "ok" },
        { out: "✔ Installing motion, lucide-react", tone: "ok" },
        { out: "✔ Created components/kinetik/like-burst.tsx", tone: "ok" },
        { cmd: "pnpm dev" },
        { out: "▲ Next.js 16 — ready on http://localhost:3000", tone: "muted" },
      ]} />
    </div>
  );
}
