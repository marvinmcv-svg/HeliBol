"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface NavExpandableLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavExpandableProps {
  brand: ReactNode;
  links: NavExpandableLink[];
  /** Call-to-action in the expanded panel. */
  cta?: ReactNode;
  className?: string;
}

/**
 * A floating pill navbar that morphs (shared layout) into a full menu card: the pill's own surface
 * grows, links stagger in, and Esc / outside click / the toggle collapse it again.
 */
export function NavExpandable({ brand, links, cta, className }: NavExpandableProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), toggle.current?.focus());
    const down = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", down);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", down); };
  }, [open]);

  const t = reduced ? { duration: 0 } : spring.smooth;
  return (
    <motion.div
      ref={ref}
      layout
      transition={t}
      style={{ borderRadius: open ? 24 : 999 }}
      className={cn("h-fit w-fit self-start overflow-hidden border border-border bg-background/80 shadow-lg backdrop-blur-xl", open && "w-[min(92vw,26rem)]", className)}
    >
      <motion.div layout="position" transition={t} className="flex items-center gap-6 py-2 pl-4 pr-2">
        <span className="text-sm font-semibold">{brand}</span>
        <button
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-controls="kn-nav-expandable"
          onClick={() => setOpen((o) => !o)}
          className="ml-auto flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden className="relative block h-2.5 w-3">
            <motion.span className="absolute left-0 h-px w-full bg-current" animate={open ? { top: "50%", rotate: 45 } : { top: "15%", rotate: 0 }} transition={t} />
            <motion.span className="absolute left-0 h-px w-full bg-current" animate={open ? { top: "50%", rotate: -45 } : { top: "85%", rotate: 0 }} transition={t} />
          </span>
        </button>
      </motion.div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav id="kn-nav-expandable" aria-label="Main" initial="hidden" animate="show" exit="hidden" className="px-2 pb-2">
            <ul>
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  variants={{ hidden: { opacity: 0, y: reduced ? 0 : 10, filter: reduced ? "none" : "blur(4px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { ...(reduced ? { duration: 0.1 } : spring.smooth), delay: reduced ? 0 : 0.06 + i * 0.04 } } }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-2.5 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none">
                    <span className="block text-lg font-medium tracking-tight">{l.label}</span>
                    {l.description && <span className="block text-xs text-muted-foreground">{l.description}</span>}
                  </a>
                </motion.li>
              ))}
            </ul>
            {cta && <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: reduced ? 0 : 0.25 } } }} className="mt-2 px-1">{cta}</motion.div>}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
