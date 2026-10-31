"use client";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

/** Custom listbox select: the menu unfolds from the trigger, options stagger in, a highlight follows the active option. */
export function SelectAnimated({ options, value: controlled, onChange, label = "Choose", className }: { options: { value: string; label: string; hint?: string }[]; value?: string; onChange?: (v: string) => void; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(options[0]?.value);
  const value = controlled ?? internal;
  const [act, setAct] = useState(0);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    setAct(Math.max(0, options.findIndex((o) => o.value === value)));
    const out = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    addEventListener("pointerdown", out);
    return () => removeEventListener("pointerdown", out);
  }, [open, options, value]);
  const pick = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onChange?.(v);
    setOpen(false);
  };
  const cur = options.find((o) => o.value === value);
  return (
    <div ref={root} className={cn("relative w-64", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) return (e.preventDefault(), setOpen(true));
          if (!open) return;
          if (e.key === "ArrowDown") (e.preventDefault(), setAct((a) => Math.min(a + 1, options.length - 1)));
          if (e.key === "ArrowUp") (e.preventDefault(), setAct((a) => Math.max(a - 1, 0)));
          if (e.key === "Enter") (e.preventDefault(), pick(options[act].value));
          if (e.key === "Escape") setOpen(false);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-lb`}
        aria-activedescendant={open ? `${id}-o${act}` : undefined}
        aria-label={`${label}: ${cur?.label}`}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-card px-3.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        {cur?.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring.snappy}><ChevronDown className="size-4 text-muted-foreground" /></motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul id={`${id}-lb`} role="listbox" initial={{ opacity: 0, scaleY: 0.85, y: -4 }} animate={{ opacity: 1, scaleY: 1, y: 0 }} exit={{ opacity: 0, scaleY: 0.9, y: -4, transition: { duration: 0.12 } }} transition={spring.snappy} className="absolute z-30 mt-2 w-full origin-top rounded-xl border border-border bg-popover p-1 shadow-xl">
            {options.map((o, i) => (
              <motion.li key={o.value} id={`${id}-o${i}`} role="option" aria-selected={o.value === value} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.025 } }} onMouseMove={() => setAct(i)} onClick={() => pick(o.value)} className="relative flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm">
                {act === i && <motion.span layoutId={`${id}-hl`} transition={spring.snappy} className="absolute inset-0 rounded-lg bg-accent" />}
                <span className="relative flex-1"><span className="block">{o.label}</span>{o.hint && <span className="block text-xs text-muted-foreground">{o.hint}</span>}</span>
                {o.value === value && <Check className="relative size-4 text-brand" />}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
