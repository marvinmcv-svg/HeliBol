"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@kinetik/core";
import { blocks, components, flows } from "@/lib/registry.generated";
import { categories } from "@/lib/taxonomy";

export function Sidebar() {
  const pathname = usePathname();
  const link = (href: string, label: string, extra?: React.ReactNode) => (
    <Link
      key={href}
      href={href}
      className={cn(
        "flex items-center justify-between rounded-md px-2 py-1 text-[13px] transition-colors",
        pathname === href ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      {extra}
    </Link>
  );
  return (
    <aside className="scrollbar-thin sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border/60 py-6 pr-3 pl-4 lg:block">
      <div className="space-y-0.5">
        {link("/components", "All components", <span className="text-[10px] text-muted-foreground">{components.length}</span>)}
        {link("/blocks", "Blocks", <span className="text-[10px] text-muted-foreground">{blocks.length}</span>)}
        {link("/flows", "Mobile flows", <span className="text-[10px] text-muted-foreground">{flows.length}</span>)}
        {link("/playground", "Motion playground")}
        {link("/docs", "Getting started")}
      </div>
      {(pathname.startsWith("/blocks") || pathname.startsWith("/flows")) && (
        <div className="mt-6">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-foreground/80">{pathname.startsWith("/blocks") ? "Blocks" : "Mobile flows"}</p>
          <div className="space-y-0.5">
            {(pathname.startsWith("/blocks") ? blocks : flows).map((m) => link(`/${pathname.startsWith("/blocks") ? "blocks" : "flows"}/${m.id}`, m.name))}
          </div>
        </div>
      )}
      {categories.map((c) => {
        const items = components.filter((m) => m.category === c.id);
        if (!items.length) return null;
        return (
          <div key={c.id} className="mt-6">
            <Link href={`/components/${c.id}`} className="mb-1 block px-2 text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:text-foreground">
              {c.name}
            </Link>
            <div className="space-y-0.5">
              {items.map((m) =>
                link(
                  `/components/${m.category}/${m.id}`,
                  m.name,
                  m.status !== "stable" ? <span className="rounded bg-brand/15 px-1 text-[9px] font-semibold uppercase text-brand">{m.status}</span> : undefined,
                ),
              )}
            </div>
          </div>
        );
      })}
    </aside>
  );
}
