"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Tag/chip input: Enter or comma pops a chip in, Backspace on empty removes the last (with a nudge first), duplicates wiggle. */
export function TagInput({ defaultTags = [], placeholder = "Add a tag…", label = "Tags", className }: { defaultTags?: string[]; placeholder?: string; label?: string; className?: string }) {
  const [tags, setTags] = useState(defaultTags);
  const [v, setV] = useState("");
  const [shake, setShake] = useState<string | null>(null);
  const [armed, setArmed] = useState(false);
  const add = () => {
    const t = v.trim().replace(/,$/, "");
    if (!t) return;
    if (tags.includes(t)) {
      setShake(t);
      setTimeout(() => setShake(null), 400);
    } else setTags((s) => [...s, t]);
    setV("");
  };
  return (
    <div className={cn("flex w-full max-w-md flex-wrap items-center gap-1.5 rounded-xl border border-input bg-card p-2 focus-within:ring-2 focus-within:ring-ring/40", className)}>
      <AnimatePresence initial={false}>
        {tags.map((t, i) => (
          <motion.span key={t} layout initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1, x: shake === t ? [0, -5, 5, -3, 3, 0] : 0 }} exit={{ scale: 0.5, opacity: 0 }} transition={spring.bouncy} className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-sm transition-colors", armed && i === tags.length - 1 ? "bg-destructive/15 text-destructive" : "bg-muted")}>
            {t}
            <button onClick={() => setTags((s) => s.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="opacity-60 hover:opacity-100"><X className="size-3" /></button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        value={v}
        aria-label={label}
        onChange={(e) => (setV(e.target.value), setArmed(false), e.target.value.endsWith(",") && add())}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.preventDefault(), add());
          if (e.key === "Backspace" && !v && tags.length) armed ? (setTags((s) => s.slice(0, -1)), setArmed(false)) : setArmed(true);
        }}
        placeholder={tags.length ? "" : placeholder}
        className="min-w-24 flex-1 bg-transparent px-1 py-1 text-sm outline-none"
      />
    </div>
  );
}
