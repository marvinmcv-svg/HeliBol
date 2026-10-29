import { cn } from "@kinetik/core/utils";
import type { Engine } from "@web/types";
import { engines } from "@/lib/taxonomy";

export function EngineBadge({ engine, className }: { engine: Engine; className?: string }) {
  const e = engines[engine];
  return <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset", e.color, className)}>{e.name}</span>;
}
