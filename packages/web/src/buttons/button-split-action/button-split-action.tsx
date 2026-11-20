"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface SplitOption { id: string; label: string; hint?: string; icon?: ReactNode }
export interface ButtonSplitActionProps {
  options: SplitOption[];
  defaultId?: string;
  onAction?: (id: string) => void;
  className?: string;
}

/**
 * Split button whose menu grows out of the button itself: the chevron opens a panel that morphs
 * from the button's shape (shared layout) with options staggering in; picking one rolls the main
 * label to the new action and closes the panel back into the button. Full menu keyboard support.
 */
export function ButtonSplitAction({ options, defaultId, onAction, className }: ButtonSplitActionProps) {
  const reduced = useReducedMotion();
  const uid = useId();
  const [sel, setSel] = useState(defaultId ?? options[0]!.id);
  const [open, setOpen] = useState(false);
  const [fired, setFired] = useState(0);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const chevron = useRef<HTMLButtonElement>(null);
  const cur = options.find((o) => o.id === sel) ?? options[0]!;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 34 };

  useEffect(() => {
    if (!open) return;
    items.current[Math.max(0, options.findIndex((o) => o.id === sel))]?.focus();
    const close = (e: PointerEvent) => !(e.target as Element).closest(`[data-split="${uid}"]`) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open, options, sel, uid]);

  const choose = (id: string) => {
    setSel(id);
    setOpen(false);
    chevron.current?.focus();
  };

  return (
    <div data-split={uid} className={cn("relative inline-block", className)}>
      <motion.div layout transition={spring} className="relative flex h-11 overflow-hidden rounded-full bg-foreground text-background shadow-lg">
        <button type="button" onClick={() => (setFired((f) => f + 1), onAction?.(sel))} className="relative flex items-center gap-2 pl-5 pr-4 text-sm font-medium outline-none focus-visible:bg-white/10">
          <span className="relative grid h-5 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={cur.id} className="col-start-1 row-start-1 flex items-center gap-2 whitespace-nowrap" initial={{ y: reduced ? 0 : 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : -22, opacity: 0 }} transition={spring}>
                {cur.icon}
                {cur.label}
              </motion.span>
            </AnimatePresence>
          </span>
          {fired > 0 && !reduced && <motion.span key={fired} aria-hidden className="absolute inset-0 bg-white" initial={{ opacity: 0.25 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} />}
        </button>
        <span aria-hidden className="my-2.5 w-px bg-background/25" />
        <button
          ref={chevron}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="More actions"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => e.key === "ArrowDown" && (e.preventDefault(), setOpen(true))}
          className="grid w-11 place-items-center outline-none focus-visible:bg-white/10"
        >
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring}><ChevronDown className="size-4" /></motion.span>
        </button>
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Actions"
            className="absolute right-0 top-full z-20 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border bg-popover p-1.5 text-popover-foreground shadow-2xl"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: -24, borderRadius: 999 }}
            animate={{ opacity: 1, scale: 1, y: 0, borderRadius: 16 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: -20, borderRadius: 999, transition: { duration: 0.18 } }}
            transition={spring}
            onKeyDown={(e) => {
              const i = items.current.findIndex((x) => x === document.activeElement);
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                items.current[(i + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length]?.focus();
              } else if (e.key === "Escape" || e.key === "Tab") {
                setOpen(false);
                if (e.key === "Escape") chevron.current?.focus();
              }
            }}
          >
            {options.map((o, i) => (
              <motion.button
                key={o.id}
                ref={(el) => void (items.current[i] = el)}
                role="menuitemradio"
                aria-checked={o.id === sel}
                type="button"
                onClick={() => choose(o.id)}
                initial={{ opacity: 0, y: reduced ? 0 : -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : 0.05 + i * 0.04 }}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left outline-none hover:bg-muted focus-visible:bg-muted"
              >
                <span className="mt-0.5 text-muted-foreground">{o.icon}</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{o.label}</span>
                  {o.hint && <span className="block text-xs text-muted-foreground">{o.hint}</span>}
                </span>
                {o.id === sel && <Check className="mt-0.5 size-4" />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
