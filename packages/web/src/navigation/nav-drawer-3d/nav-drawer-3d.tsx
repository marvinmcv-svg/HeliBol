"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface NavDrawer3DProps {
  /** The page content that gets pushed back. */
  children: ReactNode;
  links: { label: string; href: string; icon?: ReactNode }[];
  footer?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Mobile menu that pushes the page back in 3D: the page rotates on Y, slides right and scales down
 * with rounded corners and a shadow, revealing the menu underneath, whose links slide in with a
 * stagger. Tap the page (or Esc) to bring it back. The page is inert while the menu is open.
 */
export function NavDrawer3D({ children, links, footer, defaultOpen = false, className }: NavDrawer3DProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(defaultOpen);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), toggle.current?.focus());
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 220, damping: 28 };

  return (
    <div className={cn("relative h-full overflow-hidden bg-zinc-950 text-white", className)} style={{ perspective: 1200 }}>
      <nav aria-label="Menu" aria-hidden={!open} className="absolute inset-y-0 left-0 flex w-[62%] flex-col justify-between p-6 pt-16" inert={!open}>
        <ul className="space-y-1">
          {links.map((l, i) => (
            <motion.li key={l.href} initial={false} animate={open ? { x: 0, opacity: 1 } : { x: reduced ? 0 : -24, opacity: 0 }} transition={{ ...t, delay: open && !reduced ? 0.12 + i * 0.05 : 0 }}>
              <a href={l.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-lg font-medium text-white/85 hover:bg-white/5 hover:text-white">
                {l.icon && <span className="text-white/50">{l.icon}</span>}
                {l.label}
              </a>
            </motion.li>
          ))}
        </ul>
        {footer && <motion.div initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: open ? 0.35 : 0 }} className="text-xs text-white/50">{footer}</motion.div>}
      </nav>
      <motion.div
        className="relative h-full origin-left overflow-hidden bg-background text-foreground"
        initial={false}
        animate={open ? { x: "58%", rotateY: reduced ? 0 : -12, scale: reduced ? 1 : 0.82, borderRadius: 28, boxShadow: "-30px 0 60px rgb(0 0 0 / .5)" } : { x: 0, rotateY: 0, scale: 1, borderRadius: 0, boxShadow: "0 0 0 rgb(0 0 0 / 0)" }}
        transition={t}
        onClick={() => open && setOpen(false)}
      >
        <div inert={open} className="h-full">
          <button ref={toggle} type="button" onClick={(e) => (e.stopPropagation(), setOpen(true))} aria-expanded={open} aria-label="Open menu" className="absolute left-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-foreground text-background">
            <span aria-hidden className="space-y-1"><span className="block h-0.5 w-4 bg-current" /><span className="block h-0.5 w-4 bg-current" /></span>
          </button>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
