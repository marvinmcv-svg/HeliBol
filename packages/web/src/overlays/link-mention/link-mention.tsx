"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface LinkMentionProps {
  href: string;
  /** Label inside the pill. */
  children: ReactNode;
  /** Small icon/favicon for the pill (an emoji, letter or <img>). */
  icon?: ReactNode;
  /** Preview card content. */
  title: string;
  description?: string;
  image?: string;
  className?: string;
}

/**
 * Notion-style inline mention: a compact pill inside running text that opens a preview card on
 * hover or keyboard focus (short open delay, instant close), springing out of the pill.
 */
export function LinkMention({ href, children, icon, title, description, image, className }: LinkMentionProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();
  const show = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(true), 180); };
  const hide = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 80); };

  return (
    <span className="relative inline-block align-baseline" onPointerEnter={show} onPointerLeave={hide}>
      <a
        href={href}
        aria-describedby={open ? id : undefined}
        onFocus={show}
        onBlur={hide}
        className={cn("inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[0.92em] font-medium text-foreground underline decoration-border underline-offset-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      >
        {icon && <span aria-hidden className="grid size-4 place-items-center overflow-hidden rounded text-[10px]">{icon}</span>}
        {children}
      </a>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
            transition={reduced ? { duration: 0.12 } : spring.snappy}
            style={{ transformOrigin: "top left" }}
            className="absolute left-0 top-full z-50 mt-2 block w-72 overflow-hidden rounded-xl border border-border bg-popover text-left text-popover-foreground shadow-xl"
          >
            {image && <img src={image} alt="" className="block h-32 w-full object-cover" />}
            <span className="block p-3">
              <span className="block text-sm font-semibold">{title}</span>
              {description && <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{description}</span>}
              <span className="mt-2 block truncate text-[11px] text-muted-foreground">{href}</span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
