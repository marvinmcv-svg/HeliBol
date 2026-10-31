"use client";
import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PanelLeftClose } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface SidebarItem {
  icon: ReactNode;
  label: string;
  badge?: number;
}

/** App sidebar that springs between expanded and icon rail, with a gliding active indicator and tooltips when collapsed. */
export function NavSidebar({ items, brand, className }: { items: SidebarItem[]; brand?: ReactNode; className?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(items[0]?.label);
  const id = useId();
  return (
    <motion.aside animate={{ width: collapsed ? 68 : 232 }} transition={spring.smooth} className={cn("flex h-full shrink-0 flex-col border-r border-border bg-card/60 p-3", className)}>
      <div className="mb-4 flex h-9 items-center gap-2 overflow-hidden px-1.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-foreground text-background">◆</span>
        <AnimatePresence>{!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-semibold whitespace-nowrap">{brand ?? "Workspace"}</motion.span>}</AnimatePresence>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map((it) => (
          <button key={it.label} onClick={() => setActive(it.label)} aria-current={active === it.label ? "page" : undefined} aria-label={collapsed ? it.label : undefined} title={collapsed ? it.label : undefined} className={cn("relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm", active === it.label ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {active === it.label && <motion.span layoutId={id} transition={spring.snappy} className="absolute inset-0 rounded-xl bg-accent" />}
            <span className="relative shrink-0 [&>svg]:size-[18px]">{it.icon}</span>
            <AnimatePresence>{!collapsed && <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.08 } }} exit={{ opacity: 0, transition: { duration: 0.05 } }} className="relative whitespace-nowrap">{it.label}</motion.span>}</AnimatePresence>
            {it.badge ? <span className={cn("relative ml-auto grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white", collapsed && "absolute top-1 right-1 ml-0 size-4 min-w-0")}>{it.badge}</span> : null}
          </button>
        ))}
      </nav>
      <button onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="flex h-10 items-center gap-3 rounded-xl px-3 text-muted-foreground hover:bg-accent">
        <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={spring.smooth}><PanelLeftClose className="size-[18px]" /></motion.span>
      </button>
    </motion.aside>
  );
}
