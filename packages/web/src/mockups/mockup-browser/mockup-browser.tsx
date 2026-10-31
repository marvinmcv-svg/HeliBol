import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

/** Safari-style browser window chrome with traffic lights, tabs-less URL bar and lock icon around any content. */
export function MockupBrowser({ url = "kinetik.dev", children, className }: { url?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-2xl", className)}>
      <div className="flex items-center gap-3 border-b border-border bg-muted/60 px-3 py-2">
        <div className="flex gap-1.5"><span className="size-3 rounded-full bg-[#ff5f57]" /><span className="size-3 rounded-full bg-[#febc2e]" /><span className="size-3 rounded-full bg-[#28c840]" /></div>
        <div className="mx-auto flex h-6 w-1/2 min-w-40 items-center justify-center gap-1.5 rounded-md bg-background text-[11px] text-muted-foreground">
          <svg viewBox="0 0 12 12" className="size-2.5" fill="currentColor"><path d="M3 5V4a3 3 0 0 1 6 0v1h.5A1 1 0 0 1 10.5 6v4a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.5 0h3V4a1.5 1.5 0 0 0-3 0z" /></svg>
          {url}
        </div>
        <span className="w-12" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
