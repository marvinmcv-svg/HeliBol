"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface Announcement {
  label?: string;
  text: string;
  href?: string;
}

export interface BannerAnnouncementProps {
  items: Announcement[];
  /** Milliseconds per message when there are several. */
  interval?: number;
  /** Remember dismissal in localStorage under this key. */
  storageKey?: string;
  className?: string;
}

const css = `
@keyframes kn-banner-sheen { from { background-position: 200% 0; } to { background-position: -200% 0; } }
.kn-banner-sheen { background: linear-gradient(110deg, transparent 35%, rgb(255 255 255 / .25) 50%, transparent 65%) 0 0 / 200% 100%; animation: kn-banner-sheen 4s linear infinite; }
@media (prefers-reduced-motion: reduce) { .kn-banner-sheen { animation: none; } }
[data-reduce-motion] .kn-banner-sheen { animation: none; }
`;

/**
 * Top-of-page announcement bar: a sheen sweeps across, several messages rotate vertically (paused
 * on hover/focus), the arrow nudges on hover, and dismissal collapses the bar and is remembered.
 */
export function BannerAnnouncement({ items, interval = 4000, storageKey, className }: BannerAnnouncementProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!storageKey) return;
    try {
      if (localStorage.getItem(storageKey) === "1") setOpen(false);
    } catch {}
  }, [storageKey]);
  useEffect(() => {
    if (items.length < 2 || paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [items.length, interval, paused]);

  const dismiss = () => {
    setOpen(false);
    if (storageKey) try { localStorage.setItem(storageKey, "1"); } catch {}
  };
  const it = items[i];

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          role="region"
          aria-label="Announcement"
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={reduced ? { duration: 0 } : spring.smooth}
          className={cn("relative overflow-hidden bg-foreground text-background", className)}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <style href="kn-banner-announcement" precedence="kinetik">{css}</style>
          <span aria-hidden className="kn-banner-sheen pointer-events-none absolute inset-0" />
          <div className="relative flex h-10 items-center justify-center px-10 text-sm">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.a
                key={i}
                href={it.href ?? "#"}
                initial={reduced ? { opacity: 0 } : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { y: -20, opacity: 0 }}
                transition={reduced ? { duration: 0.15 } : spring.smooth}
                className="group inline-flex items-center gap-2 truncate"
              >
                {it.label && <span className="rounded-full bg-background/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">{it.label}</span>}
                <span className="truncate">{it.text}</span>
                <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </motion.a>
            </AnimatePresence>
            <button type="button" onClick={dismiss} aria-label="Dismiss announcement" className="absolute right-2 grid size-7 place-items-center rounded-md opacity-70 hover:bg-background/10 hover:opacity-100">
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
