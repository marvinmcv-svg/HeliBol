"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface ExpandPanel {
  id: string;
  title: string;
  image: string;
  caption?: string;
}

/** Accordion gallery: hovering or focusing a panel grows it with a spring while the others compress. */
export function CardExpandGallery({ panels, className }: { panels: ExpandPanel[]; className?: string }) {
  const [active, setActive] = useState(panels[0]?.id);
  return (
    <div className={cn("flex h-80 w-full gap-2", className)}>
      {panels.map((p) => {
        const on = p.id === active;
        return (
          <motion.button
            key={p.id}
            layout
            onPointerEnter={() => setActive(p.id)}
            onFocus={() => setActive(p.id)}
            aria-expanded={on}
            transition={spring.smooth}
            className="relative min-w-0 overflow-hidden rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ flex: on ? 5 : 1 }}
          >
            <img src={p.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10" />
            <motion.div className="absolute bottom-4 left-4 text-white" animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }} transition={{ delay: on ? 0.15 : 0 }}>
              <p className="text-lg font-semibold whitespace-nowrap">{p.title}</p>
              {p.caption && <p className="text-xs whitespace-nowrap text-white/70">{p.caption}</p>}
            </motion.div>
            <span className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium text-white [writing-mode:vertical-rl] rotate-180 transition-opacity", on ? "opacity-0" : "opacity-90")}>{p.title}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
