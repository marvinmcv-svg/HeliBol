import Link from "next/link";
import type { ComponentMeta } from "@web/types";
import { EngineBadge } from "./engine-badge";
import { LazyDemo } from "./lazy-demo";

const sizes = {
  md: { h: "h-56", top: "after:top-56", inner: "scale-[0.72] [height:139%] [width:139%]" },
  lg: { h: "h-80", top: "after:top-80", inner: "scale-[0.5] [height:200%] [width:200%]" },
  phone: { h: "h-[26rem]", top: "after:top-[26rem]", inner: "scale-100 h-full w-full" },
};

export function ComponentCard({ meta, href, size = "md" }: { meta: ComponentMeta; href: string; size?: keyof typeof sizes }) {
  const z = sizes[size];
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[box-shadow,border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-xl hover:shadow-black/5">
      <div className={`relative ${z.h} overflow-hidden border-b border-border bg-background`}>
        <div className={`absolute inset-0 origin-top-left ${z.inner}`}>
          <LazyDemo id={meta.id} />
        </div>
      </div>
      <Link href={href} className={`flex items-start justify-between gap-3 p-4 after:absolute after:inset-x-0 after:bottom-0 ${z.top}`}>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{meta.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{meta.description}</p>
        </div>
        <EngineBadge engine={meta.engine} className="shrink-0" />
      </Link>
    </div>
  );
}
