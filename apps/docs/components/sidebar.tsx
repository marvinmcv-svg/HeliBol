"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@kinetik/core";
import type { ComponentMeta } from "@web/types";
import { blocks, components, flows, newIds } from "@/lib/registry.generated";
import { categories, isPremium } from "@/lib/taxonomy";
import { useSaved } from "@/lib/saved";

const newSet = new Set(newIds);

/**
 * Collapsible navigation: each category is a disclosure with its count, open only where you are,
 * so 330+ items stay scannable (21st.dev / Mobbin style) instead of one endless list.
 */
export function Sidebar() {
  const pathname = usePathname();
  const saved = useSaved().length;
  const link = (href: string, label: string, extra?: React.ReactNode) => (
    <Link
      key={href}
      href={href}
      aria-current={pathname === href ? "page" : undefined}
      className={cn(
        "flex items-center justify-between gap-2 rounded-md px-2 py-1 text-[13px] transition-colors",
        pathname === href ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span className="truncate">{label}</span>
      {extra}
    </Link>
  );
  const count = (n: number, cls = "text-muted-foreground") => <span className={cn("text-[10px] tabular-nums", cls)}>{n}</span>;
  const dot = (m: ComponentMeta) => (newSet.has(m.id) ? <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-label="new" /> : undefined);

  const group = (key: string, title: string, href: string | null, items: ComponentMeta[], hrefOf: (m: ComponentMeta) => string) => {
    const open = items.some((m) => pathname === hrefOf(m)) || (href !== null && pathname === href);
    return (
      <details key={key} open={open} className="group/d mt-1">
        <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:text-foreground [&::-webkit-details-marker]:hidden">
          <ChevronRight className="size-3 shrink-0 transition-transform group-open/d:rotate-90" />
          <span className="flex-1 truncate">{title}</span>
          {count(items.length)}
        </summary>
        <div className="mt-0.5 space-y-0.5 pl-3">
          {href && link(href, `All ${title.toLowerCase()}`)}
          {items.map((m) => link(hrefOf(m), m.name, dot(m)))}
        </div>
      </details>
    );
  };

  return (
    <aside className="scrollbar-thin sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border/60 py-6 pr-3 pl-4 lg:block">
      <nav aria-label="Library" className="space-y-0.5">
        {link("/components", "All components", count(components.length))}
        {link("/components?sort=newest", "What's new", count(newIds.length, "text-brand"))}
        {link("/premium", "✦ Premium", count([...components, ...blocks].filter(isPremium).length, "text-amber-500"))}
        {link("/blocks", "Blocks", count(blocks.length))}
        {link("/templates", "Templates")}
        {link("/flows", "Mobile flows", count(flows.length))}
        {link("/components?engine=gsap", "GSAP collection", count(components.filter((m) => m.engine === "gsap").length, "text-[#0ae448]"))}
        {link("/components/3d", "three.js collection", count(components.filter((m) => m.category === "3d").length, "text-orange-500"))}
        {link("/saved", "Saved", saved ? count(saved, "text-rose-500") : undefined)}
        {link("/playground", "Motion playground")}
        {link("/docs", "Getting started")}
      </nav>
      <div className="mt-6 border-t border-border/60 pt-4">
        {group("blocks", "Blocks", "/blocks", blocks, (m) => `/blocks/${m.id}`)}
        {group("flows", "Mobile flows", "/flows", flows, (m) => `/flows/${m.id}`)}
        {categories.map((c) => {
          const items = components.filter((m) => m.category === c.id);
          return items.length ? group(c.id, c.name, `/components/${c.id}`, items, (m) => `/components/${m.category}/${m.id}`) : null;
        })}
      </div>
    </aside>
  );
}
