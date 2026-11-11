"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface AvatarTeamStackProps {
  members: TeamMember[];
  /** Avatar size in px. */
  size?: number;
  className?: string;
}

/**
 * Overlapping avatars that fan out when you hover or focus the group; the hovered person lifts and
 * shows a name card. Tap toggles on touch.
 */
export function AvatarTeamStack({ members, size = 56, className }: AvatarTeamStackProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const overlap = size * 0.42;
  const spread = size * 0.12;

  return (
    <div
      role="group"
      aria-label="Team"
      className={cn("relative inline-flex items-center", className)}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => (setOpen(false), setActive(null))}
      onFocus={() => setOpen(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && (setOpen(false), setActive(null))}
    >
      {members.map((m, i) => (
        <motion.button
          key={m.name}
          type="button"
          aria-label={`${m.name}, ${m.role}`}
          onPointerEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onClick={() => setOpen((o) => !o)}
          className="relative rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          style={{ width: size, height: size, zIndex: active === i ? 50 : members.length - i }}
          animate={{
            marginLeft: i === 0 ? 0 : open ? spread : -overlap,
            y: !reduced && active === i ? -8 : 0,
            scale: !reduced && active === i ? 1.12 : 1,
            rotate: reduced || open ? 0 : (i % 2 ? 4 : -4),
          }}
          transition={reduced ? { duration: 0 } : spring.bouncy}
        >
          <img src={m.image} alt="" className="size-full rounded-full border-2 border-background object-cover shadow-md" />
          <AnimatePresence>
            {open && active === i && (
              <motion.span
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                transition={reduced ? { duration: 0.1 } : spring.snappy}
                className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-border bg-popover px-3 py-1.5 text-left text-xs shadow-lg"
              >
                <span className="block font-medium text-popover-foreground">{m.name}</span>
                <span className="block text-muted-foreground">{m.role}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </div>
  );
}
