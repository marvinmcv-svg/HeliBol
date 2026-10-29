"use client";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { easeBezier, spring, stagger } from "@kinetik/tokens";

export interface MenuToggleMorphProps {
  links: { label: string; href: string }[];
  className?: string;
  /** Contain the overlay inside the nearest positioned parent instead of the viewport. */
  contained?: boolean;
}

export function MenuToggleMorph({ links, className, contained = false }: MenuToggleMorphProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const line = "absolute left-0 h-0.5 w-full rounded-full bg-current";
  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "Close menu" : "Open menu"}
        className={cn("relative z-50 grid size-11 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring", open && "text-background", className)}
      >
        <span className="relative block h-3.5 w-5">
          <motion.span className={line} animate={open ? { top: "50%", y: "-50%", rotate: 45 } : { top: "0%", y: "0%", rotate: 0 }} transition={spring.snappy} />
          <motion.span className={cn(line, "top-1/2 -translate-y-1/2")} animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }} transition={spring.snappy} />
          <motion.span className={line} animate={open ? { bottom: "50%", y: "50%", rotate: -45 } : { bottom: "0%", y: "0%", rotate: 0 }} transition={spring.snappy} />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            id={id}
            className={cn(contained ? "absolute" : "fixed", "inset-0 z-40 flex flex-col justify-center bg-foreground px-10 text-background")}
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 3rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 3rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 3rem)", transition: { duration: 0.45, ease: easeBezier.exit, delay: 0.15 } }}
            transition={{ duration: 0.7, ease: easeBezier.expoOut }}
          >
            <ul className="space-y-2">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block text-4xl font-semibold tracking-tight outline-none hover:opacity-70 focus-visible:underline sm:text-5xl"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%", transition: { delay: 0.2 + i * stagger.loose, duration: 0.6, ease: easeBezier.expoOut } }}
                    exit={{ y: "110%", transition: { delay: (links.length - i) * 0.03, duration: 0.25, ease: easeBezier.exit } }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
