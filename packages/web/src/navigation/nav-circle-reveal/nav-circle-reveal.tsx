"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface NavCircleRevealLink {
  label: string;
  href: string;
  image?: string;
}

export interface NavCircleRevealProps {
  links: NavCircleRevealLink[];
  /** Small print in the menu footer. */
  footer?: string;
  /** Start open (for previews). */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Full-screen menu that pours out of the menu button: a clip-path circle expands from the button's
 * centre, huge links rise in from behind a mask with stagger, and hovering a link cross-fades its
 * preview image behind the list. Closing reverses into the button. Esc closes and focus returns.
 */
export function NavCircleReveal({ links, footer = "hello@studio.com", defaultOpen = false, className }: NavCircleRevealProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(defaultOpen);
  const [hover, setHover] = useState<number | null>(null);
  const [origin, setOrigin] = useState("calc(100% - 40px) 40px");
  const btn = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), btn.current?.focus());
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);

  const toggle = () => {
    const b = btn.current?.getBoundingClientRect(), r = root.current?.getBoundingClientRect();
    if (b && r) setOrigin(`${b.left - r.left + b.width / 2}px ${b.top - r.top + b.height / 2}px`);
    setOpen((o) => !o);
  };
  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <div ref={root} className={cn("relative h-full w-full overflow-hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Main"
            initial={reduced ? { opacity: 0 } : { clipPath: `circle(0% at ${origin})` }}
            animate={reduced ? { opacity: 1 } : { clipPath: `circle(150% at ${origin})` }}
            exit={reduced ? { opacity: 0 } : { clipPath: `circle(0% at ${origin})`, transition: { duration: 0.6, ease, delay: 0.15 } }}
            transition={{ duration: reduced ? 0.15 : 0.8, ease }}
            className="absolute inset-0 z-20 flex flex-col justify-between bg-[#e8ff5a] p-8 text-zinc-900"
          >
            <AnimatePresence>
              {hover !== null && links[hover]?.image && (
                <motion.img key={hover} src={links[hover].image} alt="" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 0.35, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="pointer-events-none absolute right-8 top-1/2 hidden h-2/3 -translate-y-1/2 rounded-2xl object-cover mix-blend-multiply sm:block sm:w-2/5" />
              )}
            </AnimatePresence>
            <ul className="relative mt-10 space-y-1">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    initial={reduced ? { opacity: 0 } : { y: "110%" }}
                    animate={reduced ? { opacity: 1 } : { y: 0 }}
                    exit={reduced ? { opacity: 0 } : { y: "110%", transition: { duration: 0.35, ease, delay: (links.length - i) * 0.03 } }}
                    transition={{ duration: reduced ? 0.15 : 0.7, ease, delay: reduced ? 0 : 0.25 + i * 0.06 }}
                    className="group flex items-baseline gap-4 text-[clamp(2.4rem,8vw,4.5rem)] font-semibold leading-[1.05] tracking-tight outline-none"
                  >
                    <span className="text-xs font-medium tabular-nums opacity-50">0{i + 1}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-3 group-focus-visible:translate-x-3 group-focus-visible:underline motion-reduce:transition-none">{l.label}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: reduced ? 0 : 0.6 } }} exit={{ opacity: 0 }} className="relative text-sm">{footer}</motion.p>
          </motion.nav>
        )}
      </AnimatePresence>
      <button
        ref={btn}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={cn("absolute right-5 top-5 z-30 flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors", open ? "bg-zinc-900 text-[#e8ff5a]" : "bg-foreground text-background")}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden className="relative block h-2.5 w-4">
          <motion.span className="absolute left-0 h-0.5 w-full rounded bg-current" animate={open ? { top: "40%", rotate: 45 } : { top: "0%", rotate: 0 }} transition={{ duration: reduced ? 0 : 0.3 }} />
          <motion.span className="absolute left-0 h-0.5 w-full rounded bg-current" animate={open ? { top: "40%", rotate: -45 } : { top: "80%", rotate: 0 }} transition={{ duration: reduced ? 0 : 0.3 }} />
        </span>
      </button>
    </div>
  );
}
