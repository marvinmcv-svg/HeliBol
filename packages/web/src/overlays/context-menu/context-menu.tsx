"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";

export interface MenuAction {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  danger?: boolean;
  onSelect?: () => void;
}

/** Right-click (or Shift+F10) menu that scales from the click point with staggered items and arrow-key navigation. */
export function ContextMenu({ actions, children, className }: { actions: MenuAction[]; children: ReactNode; className?: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!pos) return;
    menu.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const close = () => setPos(null);
    addEventListener("pointerdown", close);
    addEventListener("scroll", close, true);
    return () => (removeEventListener("pointerdown", close), removeEventListener("scroll", close, true));
  }, [pos]);
  const openAt = (x: number, y: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos({ x: Math.min(x - r.left, r.width - 200), y: Math.min(y - r.top, r.height - actions.length * 36 - 12) });
  };
  return (
    <div
      ref={box}
      tabIndex={0}
      onContextMenu={(e) => (e.preventDefault(), openAt(e.clientX, e.clientY))}
      onKeyDown={(e) => {
        if ((e.shiftKey && e.key === "F10") || e.key === "ContextMenu") {
          e.preventDefault();
          const r = box.current!.getBoundingClientRect();
          openAt(r.left + 24, r.top + 24);
        }
      }}
      className={cn("relative outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      {children}
      <AnimatePresence>
        {pos && (
          <motion.ul
            ref={menu}
            role="menu"
            onPointerDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              const btns = [...(menu.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])];
              const i = btns.indexOf(document.activeElement as HTMLButtonElement);
              if (e.key === "ArrowDown") (e.preventDefault(), btns[(i + 1) % btns.length]?.focus());
              if (e.key === "ArrowUp") (e.preventDefault(), btns[(i - 1 + btns.length) % btns.length]?.focus());
              if (e.key === "Escape") setPos(null);
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            style={{ left: pos.x, top: pos.y }}
            className="absolute z-50 w-48 origin-top-left rounded-xl border border-border bg-popover p-1 shadow-2xl"
          >
            {actions.map((a, i) => (
              <motion.li key={a.label} role="none" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.025 }}>
                <button role="menuitem" onClick={() => (a.onSelect?.(), setPos(null))} className={cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent [&>svg]:size-4", a.danger && "text-destructive")}>
                  {a.icon}
                  {a.label}
                  {a.shortcut && <kbd className="ml-auto text-[10px] text-muted-foreground">{a.shortcut}</kbd>}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
