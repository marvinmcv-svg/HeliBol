"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CornerDownLeft, Search } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";
import { blocks, components, flows } from "@/lib/registry.generated";
import { categoryName } from "@/lib/taxonomy";
import { EngineBadge } from "./engine-badge";

export const openCommandMenu = () => window.dispatchEvent(new Event("kinetik:command"));

type Entry = { id: string; name: string; group: string; href: string; hay: string; engine: (typeof components)[number]["engine"] };

const entries: Entry[] = [
  ...components.map((m) => ({ id: m.id, name: m.name, group: categoryName(m.category), href: `/components/${m.category}/${m.id}`, engine: m.engine, hay: [m.name, m.id, m.category, m.engine, ...m.tags, ...m.pageTypes, m.description].join(" ").toLowerCase() })),
  ...blocks.map((m) => ({ id: m.id, name: m.name, group: "Blocks", href: `/blocks/${m.id}`, engine: m.engine, hay: [m.name, m.id, "block", ...m.tags, m.description].join(" ").toLowerCase() })),
  ...flows.map((m) => ({ id: m.id, name: m.name, group: "Mobile flows", href: `/flows/${m.id}`, engine: m.engine, hay: [m.name, m.id, "flow mobile", ...m.tags, m.description].join(" ").toLowerCase() })),
];

function score(hay: string, q: string) {
  if (!q) return 1;
  let s = 0;
  for (const term of q.toLowerCase().split(/\s+/).filter(Boolean)) {
    const i = hay.indexOf(term);
    if (i < 0) return 0;
    s += i === 0 ? 3 : 1;
  }
  return s;
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "/" && !(e.target as HTMLElement).closest("input,textarea")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("kinetik:command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("kinetik:command", onOpen);
    };
  }, []);

  const results = useMemo(
    () =>
      entries
        .map((e) => ({ e, s: score(e.hay, q) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 40)
        .map((r) => r.e),
    [q],
  );

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search components"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={spring.snappy}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="size-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") (e.preventDefault(), setSel((s) => Math.min(s + 1, results.length - 1)));
                  if (e.key === "ArrowUp") (e.preventDefault(), setSel((s) => Math.max(s - 1, 0)));
                  if (e.key === "Enter" && results[sel]) go(results[sel].href);
                  if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Search 70+ components, blocks, flows… (try “scroll”, “gsap”, “pricing”)"
                className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                role="combobox"
                aria-expanded
                aria-controls="k-cmd-list"
                aria-activedescendant={results[sel] ? `k-cmd-${results[sel].id}` : undefined}
              />
            </div>
            <ul ref={listRef} id="k-cmd-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">No results for “{q}”.</li>}
              {results.map((r, i) => (
                <li
                  key={r.id}
                  id={`k-cmd-${r.id}`}
                  role="option"
                  aria-selected={i === sel}
                  data-index={i}
                  onMouseMove={() => setSel(i)}
                  onClick={() => go(r.href)}
                  className={cn("relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm", i === sel && "text-foreground")}
                >
                  {i === sel && <motion.span layoutId="cmd-sel" transition={spring.snappy} className="absolute inset-0 rounded-lg bg-accent" />}
                  <span className="relative flex-1 truncate">{r.name}</span>
                  <span className="relative text-xs text-muted-foreground">{r.group}</span>
                  <EngineBadge engine={r.engine} className="relative" />
                  {i === sel && <CornerDownLeft className="relative size-3.5 text-muted-foreground" />}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
