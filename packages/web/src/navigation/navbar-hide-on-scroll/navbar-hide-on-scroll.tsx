"use client";
import { useState, type ReactNode, type RefObject } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface NavbarHideOnScrollProps {
  children: ReactNode;
  container?: RefObject<HTMLElement | null>;
  /** px scrolled before the bar compacts into a floating pill. */
  threshold?: number;
  className?: string;
}

export function NavbarHideOnScroll({ children, container, threshold = 40, className }: NavbarHideOnScrollProps) {
  const { scrollY } = useScroll({ container });
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
    setCompact(y > threshold);
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-120%" : "0%" }}
      transition={spring.smooth}
      onFocusCapture={() => setHidden(false)}
      className={cn("sticky top-0 z-30 flex justify-center px-3 pt-3", className)}
    >
      <motion.nav
        layout
        transition={spring.smooth}
        className={cn(
          "flex items-center gap-6 border text-sm transition-[background-color,border-color,box-shadow] duration-300",
          compact ? "rounded-full border-border bg-background/70 px-4 py-2 shadow-lg backdrop-blur-xl" : "w-full rounded-none border-transparent px-2 py-3",
        )}
      >
        {children}
      </motion.nav>
    </motion.header>
  );
}
