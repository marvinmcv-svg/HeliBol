"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { durationS, spring } from "@kinetik/tokens";

export interface TabItem {
  id: string;
  label: ReactNode;
  content?: ReactNode;
}

export interface AnimatedTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  variant?: "pill" | "underline";
  className?: string;
}

export function AnimatedTabs({ tabs, defaultTab, onChange, variant = "pill", className }: AnimatedTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const [dir, setDir] = useState(1);
  const group = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = tabs.findIndex((t) => t.id === active);

  const select = (i: number) => {
    const t = tabs[i];
    if (!t) return;
    setDir(i > idx ? 1 : -1);
    setActive(t.id);
    onChange?.(t.id);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (e.key in map) {
      const n = (idx + map[e.key] + tabs.length) % tabs.length;
      select(n);
      refs.current[n]?.focus();
    }
  };

  const current = tabs[idx];
  return (
    <div className={cn("w-full", className)}>
      <div role="tablist" onKeyDown={onKey} className={cn("relative inline-flex items-center gap-1", variant === "pill" ? "rounded-full bg-muted p-1" : "border-b border-border")}>
        {tabs.map((t, i) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`${group}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${group}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              className={cn(
                "relative px-4 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                variant === "pill" ? "rounded-full" : "pb-2.5",
                selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${group}-indicator`}
                  transition={spring.snappy}
                  className={cn("absolute", variant === "pill" ? "inset-0 rounded-full bg-background shadow-sm" : "inset-x-2 -bottom-px h-0.5 rounded-full bg-foreground")}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>
      {current?.content !== undefined && (
        <div role="tabpanel" id={`${group}-panel`} aria-labelledby={`${group}-tab-${active}`} className="relative mt-4 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              initial={{ opacity: 0, x: dir * 24, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir * -24, filter: "blur(4px)" }}
              transition={{ duration: durationS.moderate, ease: [0.16, 1, 0.3, 1] }}
            >
              {current.content}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
