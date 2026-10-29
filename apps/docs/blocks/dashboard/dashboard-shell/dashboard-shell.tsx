"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BarChart3, ChevronsLeft, Home, Inbox, Settings, Users } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";
import { StatCounterGrid } from "@web/data/stat-counter-grid/stat-counter-grid";
import { ChartLineDraw } from "@web/data/chart-line-draw/chart-line-draw";
import { AnimatedTabs } from "@web/layout/animated-tabs/animated-tabs";

const nav = [
  { icon: Home, label: "Overview" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Inbox, label: "Inbox", badge: 3 },
  { icon: Users, label: "Customers" },
  { icon: Settings, label: "Settings" },
];

export function DashboardShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Overview");
  return (
    <div className="flex h-full overflow-hidden bg-background text-sm">
      <motion.aside animate={{ width: collapsed ? 64 : 208 }} transition={spring.smooth} className="flex shrink-0 flex-col border-r border-border bg-card/50 p-3">
        <div className="mb-4 flex h-8 items-center gap-2 px-1.5 font-semibold">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-foreground text-background">◆</span>
          <AnimatePresence>{!collapsed && <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}>Northwind</motion.span>}</AnimatePresence>
        </div>
        <nav className="space-y-1">
          {nav.map((n) => (
            <button key={n.label} onClick={() => setActive(n.label)} aria-label={collapsed ? n.label : undefined} aria-current={active === n.label ? "page" : undefined} className={cn("relative flex h-9 w-full items-center gap-3 rounded-lg px-2.5", active === n.label ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {active === n.label && <motion.span layoutId="dash-active" transition={spring.snappy} className="absolute inset-0 rounded-lg bg-accent" />}
              <n.icon className="relative size-4 shrink-0" />
              <AnimatePresence>{!collapsed && <motion.span className="relative whitespace-nowrap" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} exit={{ opacity: 0, transition: { duration: 0.05 } }}>{n.label}</motion.span>}</AnimatePresence>
              {n.badge && <span className={cn("relative ml-auto grid size-5 place-items-center rounded-full bg-brand text-[10px] font-semibold text-white", collapsed && "absolute top-0.5 right-1 size-4")}>{n.badge}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="mt-auto flex h-9 items-center gap-3 rounded-lg px-2.5 text-muted-foreground hover:bg-accent">
          <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={spring.smooth}><ChevronsLeft className="size-4" /></motion.span>
        </button>
      </motion.aside>
      <main className="min-w-0 flex-1 space-y-5 overflow-auto p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-lg font-semibold">{active}</h1><p className="text-xs text-muted-foreground">Last 7 days</p></div>
          <AnimatedTabs className="w-auto" tabs={[{ id: "7d", label: "7d" }, { id: "30d", label: "30d" }, { id: "90d", label: "90d" }]} />
        </div>
        <StatCounterGrid stats={[
          { label: "Revenue", value: 48210, prefix: "$", delta: 12.4, spark: [4, 6, 5, 8, 7, 9, 12, 11, 14] },
          { label: "Active users", value: 9284, delta: 4.1, spark: [5, 5, 6, 7, 6, 8, 8, 9, 10] },
          { label: "Churn", value: 2.3, suffix: "%", decimals: 1, delta: -0.6, spark: [9, 8, 8, 7, 6, 6, 5, 4, 4] },
          { label: "NPS", value: 71, delta: 3, spark: [5, 6, 6, 7, 8, 7, 8, 9, 9] },
        ]} />
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-3 font-semibold">Signups</p>
          <ChartLineDraw height={180} data={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => ({ label, value: [120, 180, 150, 260, 240, 330, 410][i] }))} />
        </div>
      </main>
    </div>
  );
}
