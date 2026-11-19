"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface Sheet {
  id: string;
  title: string;
  content: ReactNode;
}

export interface SheetStackProps {
  /** The page under the sheets. */
  children: ReactNode;
  /** Open sheets, bottom to top. */
  sheets: Sheet[];
  onClose: (id: string) => void;
  className?: string;
}

/**
 * iOS-style stacked sheets: each new sheet slides up and the layers beneath scale back, dim and
 * round their corners — the page recedes like a card deck. Drag a sheet down (or press Esc / the
 * grabber) to dismiss it; everything below springs forward again.
 */
export function SheetStack({ children, sheets, onClose, className }: SheetStackProps) {
  const reduced = useReducedMotion();
  const top = sheets.at(-1);
  const topRef = useRef<HTMLDivElement>(null);
  const depth = sheets.length;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 36 };

  const topId = top?.id;
  useEffect(() => {
    if (!topId) return;
    topRef.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(topId);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [topId, onClose]);

  // how far a layer recedes, given how many sheets sit above it
  const recede = (above: number) => (reduced || above === 0 ? {} : { scale: 1 - 0.06 * above, y: -10 * above, borderRadius: 18, filter: `brightness(${1 - 0.18 * above})` });

  return (
    <div className={cn("relative h-full overflow-hidden bg-black", className)}>
      <motion.div className="h-full origin-top overflow-hidden bg-background" animate={{ scale: 1, y: 0, borderRadius: 0, filter: "brightness(1)", ...recede(depth) }} transition={spring} aria-hidden={depth > 0}>
        {children}
      </motion.div>
      <AnimatePresence>
        {sheets.map((s, i) => {
          const above = depth - 1 - i;
          const isTop = above === 0;
          return (
            <motion.div
              key={s.id}
              ref={isTop ? topRef : undefined}
              role="dialog"
              aria-modal={isTop}
              aria-label={s.title}
              aria-hidden={!isTop}
              tabIndex={-1}
              initial={reduced ? { opacity: 0 } : { y: "100%" }}
              animate={{ opacity: 1, y: 0, scale: 1, borderRadius: 18, filter: "brightness(1)", ...recede(above) }}
              exit={reduced ? { opacity: 0 } : { y: "100%" }}
              transition={spring}
              drag={isTop && !reduced ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.8 }}
              onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose(s.id)}
              className="absolute inset-x-0 bottom-0 flex origin-top flex-col overflow-hidden bg-card shadow-[0_-10px_40px_rgb(0_0_0/.35)] outline-none"
              style={{ top: 28 + i * 14 }}
            >
              <button type="button" onClick={() => onClose(s.id)} aria-label={`Close ${s.title}`} className="mx-auto mt-2 h-5 w-14 shrink-0 cursor-grab">
                <span className="mx-auto block h-1 w-10 rounded-full bg-muted-foreground/40" />
              </button>
              <h2 className="px-5 pb-2 text-lg font-semibold">{s.title}</h2>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">{s.content}</div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
