"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";
import { CopyButton } from "./copy-button";

export interface CodeTab {
  id: string;
  label: string;
  html: string;
  raw: string;
}

export function CodeTabs({ tabs, className }: { tabs: CodeTab[]; className?: string }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActive(t.id)} className={cn("relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", active === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {active === t.id && <motion.span layoutId="code-tab" transition={spring.snappy} className="absolute inset-0 -z-0 rounded-lg bg-accent" />}
            <span className="relative">{t.label}</span>
          </button>
        ))}
        <CopyButton text={tab.raw} label="Copy" className="ml-auto" />
      </div>
      <div className={cn("relative overflow-auto text-[13px] leading-relaxed [&_pre]:p-4", expanded ? "max-h-[80vh]" : "max-h-[420px]")}>
        <div dangerouslySetInnerHTML={{ __html: tab.html }} />
      </div>
      {tab.raw.split("\n").length > 22 && (
        <button onClick={() => setExpanded((e) => !e)} className="w-full border-t border-border py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
          {expanded ? "Collapse" : "Expand code"}
        </button>
      )}
    </div>
  );
}
