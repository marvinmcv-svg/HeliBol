"use client";
import { useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { cn, prefersReducedMotion } from "@kinetik/core";

/** Run a state update inside a View Transition (falls back to a plain update). */
export function withViewTransition(update: () => void) {
  if (typeof document === "undefined" || !document.startViewTransition || prefersReducedMotion()) return update();
  document.startViewTransition(() => flushSync(update));
}

export interface SharedItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  body?: ReactNode;
}

export interface VtSharedElementProps {
  items: SharedItem[];
  className?: string;
}

/** Card grid → detail view where image and title morph between states via `view-transition-name`. */
export function VtSharedElement({ items, className }: VtSharedElementProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = items.find((i) => i.id === openId);
  const vt = (id: string, part: string) => ({ viewTransitionName: `k-${part}-${id}` }) as React.CSSProperties;

  if (open) {
    return (
      <article className={cn("flex h-full flex-col overflow-auto", className)}>
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden" style={vt(open.id, "img")}>
          <img src={open.image} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="space-y-3 p-6">
          <h3 className="text-2xl font-semibold tracking-tight" style={vt(open.id, "title")}>{open.title}</h3>
          <p className="text-sm text-muted-foreground">{open.subtitle}</p>
          <div className="text-sm leading-relaxed">{open.body}</div>
          <button
            autoFocus
            onClick={() => withViewTransition(() => setOpenId(null))}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent"
          >
            ← Back
          </button>
        </div>
      </article>
    );
  }

  return (
    <ul className={cn("grid grid-cols-2 gap-3 p-4 sm:grid-cols-3", className)}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => withViewTransition(() => setOpenId(item.id))}
            className="group w-full overflow-hidden rounded-xl border border-border bg-card text-left transition-shadow hover:shadow-lg"
          >
            <div className="aspect-[4/3] overflow-hidden" style={vt(item.id, "img")}>
              <img src={item.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="p-3 text-sm font-medium" style={vt(item.id, "title")}>{item.title}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
