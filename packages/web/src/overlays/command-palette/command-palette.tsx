"use client";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface Command {
  id: string;
  label: string;
  group: string;
  icon?: ReactNode;
  shortcut?: string;
  run?: () => void;
}

/** ⌘K command palette: springs open, fuzzy filters, groups results, and a highlight glides between items (arrow keys + Enter). */
export function CommandPalette({ commands, open, onOpenChange, className }: { commands: Command[]; open: boolean; onOpenChange: (o: boolean) => void; className?: string }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const hl = useId();
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") (e.preventDefault(), onOpenChange(!open));
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open, onOpenChange]);
  const results = useMemo(() => commands.filter((c) => q.toLowerCase().split(" ").every((t) => `${c.label} ${c.group}`.toLowerCase().includes(t))), [q, commands]);
  useEffect(() => setSel(0), [q]);
  const groups = [...new Set(results.map((r) => r.group))];
  const run = (c?: Command) => {
    if (!c) return;
    c.run?.();
    onOpenChange(false);
    setQ("");
  };
  return (
    <AnimatePresence>
      {open && (
        <div className={cn("fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]", className)}>
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => onOpenChange(false)} />
          <motion.div role="dialog" aria-modal="true" aria-label="Command palette" initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={spring.snappy} className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="size-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") (e.preventDefault(), setSel((s) => Math.min(s + 1, results.length - 1)));
                  if (e.key === "ArrowUp") (e.preventDefault(), setSel((s) => Math.max(s - 1, 0)));
                  if (e.key === "Enter") run(results[sel]);
                  if (e.key === "Escape") onOpenChange(false);
                }}
                placeholder="Type a command or search…"
                role="combobox"
                aria-expanded
                className="h-12 flex-1 bg-transparent text-sm outline-none"
              />
              <kbd className="rounded border border-border px-1.5 text-[10px] text-muted-foreground">esc</kbd>
            </div>
            <motion.div layout className="max-h-80 overflow-y-auto p-2" role="listbox">
              {results.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No results</p>}
              {groups.map((g) => (
                <div key={g}>
                  <p className="px-2 pt-2 pb-1 text-[11px] font-medium text-muted-foreground">{g}</p>
                  {results.filter((r) => r.group === g).map((c) => {
                    const i = results.indexOf(c);
                    return (
                      <button key={c.id} role="option" aria-selected={i === sel} onMouseMove={() => setSel(i)} onClick={() => run(c)} className="relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm [&>svg]:size-4">
                        {i === sel && <motion.span layoutId={hl} transition={spring.snappy} className="absolute inset-0 rounded-lg bg-accent" />}
                        <span className="relative text-muted-foreground [&>svg]:size-4">{c.icon}</span>
                        <span className="relative">{c.label}</span>
                        {c.shortcut && <kbd className="relative ml-auto text-[11px] text-muted-foreground">{c.shortcut}</kbd>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
