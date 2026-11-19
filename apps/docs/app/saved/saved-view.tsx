"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { ComponentMeta } from "@web/types";
import { Browse, type ItemKind } from "@/components/browse";
import { blocks, components, flows } from "@/lib/registry.generated";
import { clearSaved, useSaved } from "@/lib/saved";

const all: ComponentMeta[] = [...components, ...blocks, ...flows];
const kinds = new Map<string, ItemKind>([...blocks.map((b) => [b.id, "block"] as const), ...flows.map((f) => [f.id, "flow"] as const)]);

export function SavedView() {
  const saved = useSaved();
  const items = saved.map((id) => all.find((m) => m.id === id)).filter((m): m is ComponentMeta => !!m);
  if (!items.length)
    return (
      <div className="rounded-3xl border border-dashed border-border p-12 text-center">
        <Heart className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-4 font-medium">Nothing saved yet</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Tap the heart on any card or component page to collect it here. Saves stay in this browser.</p>
        <Link href="/components?sort=newest" className="mt-6 inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">Browse what&apos;s new</Link>
      </div>
    );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(items.map((m) => `npx shadcn@latest add ${location.origin}/r/${m.id}.json`).join("\n"))}
          className="rounded-full border border-border px-3.5 py-1.5 text-sm hover:bg-muted"
        >
          Copy install commands for all {items.length}
        </button>
        <button type="button" onClick={() => confirm("Remove all saved items?") && clearSaved()} className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground">
          Clear
        </button>
      </div>
      <Browse items={items} kindOf={(m) => kinds.get(m.id) ?? "component"} />
    </div>
  );
}
