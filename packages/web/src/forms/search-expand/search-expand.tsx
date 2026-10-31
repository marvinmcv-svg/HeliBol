"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Search icon that springs open into a full field (and collapses when empty and blurred); "/" focuses it. */
export function SearchExpand({ placeholder = "Search…", onSearch, className }: { placeholder?: string; onSearch?: (q: string) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target as HTMLElement).closest("input,textarea")) (e.preventDefault(), setOpen(true));
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);
  useEffect(() => void (open && input.current?.focus()), [open]);
  return (
    <motion.form role="search" onSubmit={(e) => (e.preventDefault(), onSearch?.(q))} animate={{ width: open ? 300 : 44 }} transition={spring.smooth} className={cn("flex h-11 items-center overflow-hidden rounded-full border border-border bg-card shadow-sm", className)}>
      <button type={open ? "submit" : "button"} onClick={() => !open && setOpen(true)} aria-label={open ? "Search" : "Open search"} className="grid size-11 shrink-0 place-items-center text-muted-foreground hover:text-foreground"><Search className="size-[18px]" /></button>
      <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => !q && setOpen(false)} onKeyDown={(e) => e.key === "Escape" && (setQ(""), setOpen(false))} placeholder={placeholder} aria-label="Search" tabIndex={open ? 0 : -1} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
      {open && q && <button type="button" onClick={() => (setQ(""), input.current?.focus())} aria-label="Clear" className="mr-2 grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-accent"><X className="size-3.5" /></button>}
    </motion.form>
  );
}
