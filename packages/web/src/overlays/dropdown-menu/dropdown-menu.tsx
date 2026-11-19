"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export type DropdownItem =
  | { type?: "item"; label: string; icon?: ReactNode; shortcut?: string; danger?: boolean; onSelect?: () => void }
  | { type: "check"; label: string; checked: boolean; onCheckedChange: (v: boolean) => void }
  | { type: "separator" }
  | { type: "label"; label: string };

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
  className?: string;
}

/**
 * Menu button with the full WAI-ARIA keyboard model (arrows, Home/End, type-ahead, Esc returns
 * focus). The panel springs from the trigger's corner, items stagger in, and a highlight pill
 * glides between items as you hover or arrow through them.
 */
export function DropdownMenu({ trigger, items, align = "start", className }: DropdownMenuProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const focusable = items.map((it, i) => (it.type === "separator" || it.type === "label" ? -1 : i)).filter((i) => i >= 0);

  const close = (refocus = true) => {
    setOpen(false);
    setActive(-1);
    if (refocus) btn.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    menu.current?.focus();
    const down = (e: PointerEvent) => !menu.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node) && close(false);
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [open]);

  const select = (i: number) => {
    const it = items[i];
    if (!it) return;
    if (it.type === "check") it.onCheckedChange(!it.checked);
    else if (it.type !== "separator" && it.type !== "label") {
      it.onSelect?.();
      close();
    }
  };
  const move = (dir: 1 | -1) => {
    const pos = focusable.indexOf(active);
    setActive(focusable[(pos + dir + focusable.length) % focusable.length]);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") (e.preventDefault(), move(1));
    else if (e.key === "ArrowUp") (e.preventDefault(), move(-1));
    else if (e.key === "Home") (e.preventDefault(), setActive(focusable[0]));
    else if (e.key === "End") (e.preventDefault(), setActive(focusable.at(-1)!));
    else if (e.key === "Enter" || e.key === " ") (e.preventDefault(), select(active));
    else if (e.key === "Escape" || e.key === "Tab") close(e.key === "Escape");
    else if (e.key.length === 1) {
      const hit = focusable.find((i) => { const it = items[i]; return "label" in it && it.label.toLowerCase().startsWith(e.key.toLowerCase()); });
      if (hit !== undefined) setActive(hit);
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onClick={() => (open ? close() : (setOpen(true), setActive(focusable[0])))}
        onKeyDown={(e) => e.key === "ArrowDown" && (e.preventDefault(), setOpen(true), setActive(focusable[0]))}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {trigger}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={reduced ? { duration: 0 } : spring.snappy}>
          <ChevronDown className="size-4 text-muted-foreground" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menu}
            id={`${id}-menu`}
            role="menu"
            tabIndex={-1}
            aria-activedescendant={active >= 0 ? `${id}-i${active}` : undefined}
            onKeyDown={onKey}
            variants={{
              hidden: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -4 },
              show: { opacity: 1, scale: 1, y: 0, transition: reduced ? { duration: 0.1 } : { ...spring.snappy, staggerChildren: 0.025 } },
              exit: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, transition: { duration: 0.12 } },
            }}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ transformOrigin: align === "end" ? "top right" : "top left" }}
            className={cn("absolute top-full z-50 mt-2 min-w-56 rounded-2xl border border-border bg-popover p-1.5 text-sm text-popover-foreground shadow-xl outline-none", align === "end" ? "right-0" : "left-0")}
          >
            {items.map((it, i) => {
              if (it.type === "separator") return <div key={i} role="separator" className="my-1 h-px bg-border" />;
              if (it.type === "label") return <p key={i} className="px-2.5 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{it.label}</p>;
              const isCheck = it.type === "check";
              return (
                <motion.div
                  key={i}
                  id={`${id}-i${i}`}
                  role={isCheck ? "menuitemcheckbox" : "menuitem"}
                  aria-checked={isCheck ? it.checked : undefined}
                  variants={reduced ? undefined : { hidden: { opacity: 0, y: -4 }, show: { opacity: 1, y: 0 } }}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => select(i)}
                  className={cn("relative flex cursor-default select-none items-center gap-2.5 rounded-lg px-2.5 py-1.5", !isCheck && it.danger && "text-rose-500")}
                >
                  {active === i && <motion.span layoutId={`${id}-hl`} transition={reduced ? { duration: 0 } : spring.snappy} className="absolute inset-0 rounded-lg bg-muted" />}
                  <span className="relative grid size-4 place-items-center text-muted-foreground">
                    {isCheck ? (it.checked ? <Check className="size-4 text-foreground" /> : null) : it.icon}
                  </span>
                  <span className="relative flex-1">{it.label}</span>
                  {!isCheck && it.shortcut && <kbd className="relative font-sans text-xs text-muted-foreground">{it.shortcut}</kbd>}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
