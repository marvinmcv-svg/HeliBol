"use client";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export type BadgeVariant = "live" | "shine" | "count" | "status";

export interface BadgeAnimatedProps {
  variant?: BadgeVariant;
  children?: ReactNode;
  /** For variant="count": the number shown; changes bump the badge. */
  count?: number;
  /** For variant="status". */
  status?: "online" | "away" | "busy" | "offline";
  className?: string;
}

const css = `
@keyframes kn-badge-ping { 75%, 100% { transform: scale(2.4); opacity: 0; } }
@keyframes kn-badge-shine { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(220%) skewX(-20deg); } }
.kn-badge-ping { animation: kn-badge-ping 1.4s cubic-bezier(0,0,.2,1) infinite; }
.kn-badge-shine::after { content: ""; position: absolute; inset: 0; width: 40%; background: linear-gradient(90deg, transparent, rgb(255 255 255 / .55), transparent); animation: kn-badge-shine 2.6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .kn-badge-ping, .kn-badge-shine::after { animation: none; } }
[data-reduce-motion] .kn-badge-ping, [data-reduce-motion] .kn-badge-shine::after { animation: none; }
`;

const statusColor = { online: "bg-emerald-500", away: "bg-amber-500", busy: "bg-rose-500", offline: "bg-zinc-400" };

/**
 * Four badge behaviours in one: a pinging "live" dot, a metallic shine sweep, a counter that
 * bumps and rolls when it changes (capped at 99+), and a presence status dot.
 */
export function BadgeAnimated({ variant = "live", children, count = 0, status = "online", className }: BadgeAnimatedProps) {
  const reduced = useReducedMotion();
  const style = <style href="kn-badge-animated" precedence="kinetik">{css}</style>;

  if (variant === "count") {
    const label = count > 99 ? "99+" : String(count);
    return (
      <motion.span
        key={reduced ? undefined : count}
        initial={reduced ? false : { scale: 1.35 }}
        animate={{ scale: 1 }}
        transition={spring.bouncy}
        aria-label={`${count} unread`}
        className={cn("inline-grid h-5 min-w-5 place-items-center overflow-hidden rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold tabular-nums text-white", className)}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={label} initial={reduced ? { opacity: 0 } : { y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { y: -10, opacity: 0 }} transition={spring.snappy}>
            {label}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    );
  }

  if (variant === "status")
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-medium", !children && "capitalize", className)}>
        {style}
        <span className="relative flex size-2">
          {status === "online" && <span className={cn("kn-badge-ping absolute inline-flex size-full rounded-full opacity-60", statusColor[status])} />}
          <span className={cn("relative inline-flex size-2 rounded-full", statusColor[status])} />
        </span>
        {children ?? status}
      </span>
    );

  if (variant === "shine")
    return (
      <span className={cn("kn-badge-shine relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 px-2.5 py-0.5 text-xs font-semibold text-amber-950", className)}>
        {style}
        {children ?? "Pro"}
      </span>
    );

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400", className)}>
      {style}
      <span className="relative flex size-2">
        <span className="kn-badge-ping absolute inline-flex size-full rounded-full bg-rose-500 opacity-70" />
        <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
      </span>
      {children ?? "Live"}
    </span>
  );
}
