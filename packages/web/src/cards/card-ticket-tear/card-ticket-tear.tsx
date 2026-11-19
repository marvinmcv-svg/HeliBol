"use client";
import { useState, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface CardTicketTearProps {
  /** Main ticket body. */
  children: ReactNode;
  /** The tear-off stub. */
  stub: ReactNode;
  /** Called once the stub is torn off. */
  onTear?: () => void;
  className?: string;
}

/**
 * A boarding-pass style ticket whose stub you drag down to tear off along the perforation: the
 * stub hinges and rotates as you pull, the ragged edge appears, and past the threshold it drops
 * away with gravity; a button provides the same action for keyboard users.
 */
export function CardTicketTear({ children, stub, onTear, className }: CardTicketTearProps) {
  const reduced = useReducedMotion();
  const [torn, setTorn] = useState(false);
  const y = useMotionValue(0);
  const rotate = useTransform(y, [0, 140], [0, 9]);
  const gap = useTransform(y, [0, 30], [0, 1]);

  const tear = () => {
    setTorn(true);
    onTear?.();
    if (reduced) return y.set(600);
    animate(y, 700, { type: "tween", ease: [0.5, 0, 0.9, 0.4], duration: 0.7 });
  };

  return (
    <div className={cn("relative w-72 select-none", className)}>
      <div className="relative rounded-t-3xl bg-card p-6 shadow-xl ring-1 ring-border">
        {children}
        {/* perforation notches */}
        <span aria-hidden className="absolute -bottom-3 -left-3 size-6 rounded-full bg-background ring-1 ring-border [clip-path:inset(0_0_50%_50%)]" />
        <span aria-hidden className="absolute -bottom-3 -right-3 size-6 rounded-full bg-background ring-1 ring-border [clip-path:inset(0_50%_50%_0)]" />
      </div>
      <motion.div aria-hidden style={{ opacity: gap }} className="mx-4 h-1 [background:radial-gradient(circle,var(--color-border,#ccc)_1px,transparent_1.5px)_0_0/8px_4px]" />
      <motion.div
        drag={torn ? false : "y"}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.9 }}
        dragSnapToOrigin={!torn}
        onDragEnd={(_, info) => info.offset.y > 110 && tear()}
        style={{ y, rotate, transformOrigin: "0% 0%" }}
        transition={spring.smooth}
        className={cn("relative cursor-grab rounded-b-3xl bg-card p-6 shadow-xl ring-1 ring-border active:cursor-grabbing", torn && "pointer-events-none")}
      >
        <span aria-hidden className="absolute inset-x-0 -top-px h-2 [background:linear-gradient(135deg,transparent_33%,var(--color-card,#fff)_33%_66%,transparent_66%)_0_0/10px_8px]" />
        {stub}
        {!torn && (
          <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>↓ Pull to tear</span>
            <button type="button" onClick={tear} className="rounded-full border border-border px-2.5 py-1 font-medium hover:text-foreground">Tear stub</button>
          </div>
        )}
      </motion.div>
      <p className="sr-only" aria-live="polite">{torn ? "Stub torn off" : ""}</p>
    </div>
  );
}
